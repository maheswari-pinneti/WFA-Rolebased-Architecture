import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { io as ioClient } from 'socket.io-client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../database/wfa.db');

console.log(`Connecting to simulator database at: ${dbPath}`);
const db = new sqlite3.Database(dbPath);

const all = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function onRun(err) {
    if (err) reject(err);
    else resolve(this);
  });
});

// Establish socket connection to the active dev/production server
const socketUrl = 'http://localhost:5000';
console.log(`Connecting Socket.IO client daemon to: ${socketUrl}`);
const socket = ioClient(socketUrl);

socket.on('connect', () => {
  console.log('⚡ Socket.IO client connected to backend server. Ready to emit live events.');
  // Join organization space
  socket.emit('join-room', 'org-stackly');
});

socket.on('connect_error', (err) => {
  console.warn(`⚠️ Socket connection failed: ${err.message}. Running database writes only.`);
});

async function runSimulationStep() {
  try {
    // Select a random active employee
    const employees = await all("SELECT * FROM employees WHERE status = 'ACTIVE' AND role != 'ADMIN'");
    if (!employees || employees.length === 0) return;

    const emp = employees[Math.floor(Math.random() * employees.length)];
    const roll = Math.random();

    // 1. Roll for check-in simulation (40% probability)
    if (roll < 0.40) {
      const todayStr = new Date().toISOString().split('T')[0];
      
      // Check if employee already checked in today
      db.get('SELECT * FROM attendance_records WHERE employeeId = ? AND date = ?', [emp.id, todayStr], async (err, row) => {
        if (err || row) return; // Skip if session exists

        const recordId = `att-${Math.random().toString(36).slice(2, 11)}`;
        const checkInTime = new Date().toISOString();
        const workMode = Math.random() < 0.3 ? 'Remote' : 'Office';

        console.log(`[SIMULATOR] Clocking IN: ${emp.name} (${emp.id}) mode: ${workMode}`);

        await run(
          `INSERT INTO attendance_records 
           (id, employeeId, employeeName, department, date, checkInTime, checkOutTime, breaks, shiftType, workMode, status, latitude, longitude, accuracy, idempotencyKey, team, organizationId)
           VALUES (?, ?, ?, ?, ?, ?, NULL, '[]', 'Regular', ?, 'Checked In', 12.9716, 77.5946, 10, ?, ?, 'org-stackly')`,
          [recordId, emp.id, emp.name, emp.department, todayStr, checkInTime, workMode, `idemp-${recordId}`, emp.team]
        );

        // Emit real-time events to update the dashboard instantly
        if (socket.connected) {
          socket.emit('attendance:check-in', {
            id: recordId,
            employeeId: emp.id,
            employeeName: emp.name,
            department: emp.department,
            date: todayStr,
            checkInTime,
            workMode,
            status: 'Checked In',
            organizationId: 'org-stackly'
          });
          socket.emit('dashboard:kpi-updated', { organizationId: 'org-stackly' });
        }
      });

    // 2. Roll for check-out simulation (30% probability)
    } else if (roll < 0.70) {
      const todayStr = new Date().toISOString().split('T')[0];

      db.get("SELECT * FROM attendance_records WHERE employeeId = ? AND date = ? AND status = 'Checked In'", [emp.id, todayStr], async (err, row) => {
        if (err || !row) return;

        const checkOutTime = new Date().toISOString();
        console.log(`[SIMULATOR] Clocking OUT: ${emp.name} (${emp.id})`);

        await run(
          "UPDATE attendance_records SET checkOutTime = ?, status = 'Checked Out' WHERE id = ?",
          [checkOutTime, row.id]
        );

        if (socket.connected) {
          socket.emit('attendance:check-out', {
            id: row.id,
            employeeId: emp.id,
            employeeName: emp.name,
            date: todayStr,
            checkOutTime,
            status: 'Checked Out',
            organizationId: 'org-stackly'
          });
          socket.emit('dashboard:kpi-updated', { organizationId: 'org-stackly' });
        }
      });

    // 3. Roll for task update / notification simulation (30% probability)
    } else {
      const taskText = `Completed daily code sync audit iteration.`;
      console.log(`[SIMULATOR] Creating Notification Task for: ${emp.name}`);
      
      const taskId = `tsk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      await run(
        `INSERT INTO tasks (id, title, assigneeId, assigneeName, department, team, organizationId, priority, status, points, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, 'org-stackly', 'MEDIUM', 'TODO', 10, ?)`,
        [taskId, taskText, emp.id, emp.name, emp.department, emp.team, new Date().toISOString()]
      );

      if (socket.connected) {
        socket.emit('send-notification', {
          userId: emp.id,
          title: 'New Task Assigned',
          message: taskText,
          timestamp: new Date().toISOString()
        });
      }
    }
  } catch (error) {
    console.error('Simulation step error:', error);
  }
}

// Tick interval rate (default every 5 seconds)
const intervalSeconds = 5;
console.log(`Starting real-time workday daemon loop. Ticking every ${intervalSeconds} seconds...`);
setInterval(runSimulationStep, intervalSeconds * 1000);
