import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDir = path.join(__dirname, '..', '..', 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'wfa.db');
export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log(`Connected to the SQLite database at: ${dbPath}`);
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password_hash TEXT,
        role TEXT,
        department TEXT,
        team TEXT,
        location TEXT,
        title TEXT,
        status TEXT,
        permissions TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS attendance_records (
        id TEXT PRIMARY KEY,
        employeeId TEXT,
        employeeName TEXT,
        department TEXT,
        date TEXT,
        checkInTime TEXT,
        checkOutTime TEXT,
        status TEXT,
        shiftType TEXT,
        workMode TEXT,
        latitude REAL,
        longitude REAL,
        accuracy REAL,
        idempotencyKey TEXT UNIQUE
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS breaks (
        id TEXT PRIMARY KEY,
        recordId TEXT,
        start TEXT,
        end TEXT,
        FOREIGN KEY(recordId) REFERENCES attendance_records(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS correction_requests (
        id TEXT PRIMARY KEY,
        employeeId TEXT,
        employeeName TEXT,
        department TEXT,
        date TEXT,
        requestedCheckIn TEXT,
        requestedCheckOut TEXT,
        reason TEXT,
        status TEXT,
        managerComment TEXT,
        reviewedBy TEXT,
        createdAt TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        employeeId TEXT,
        action TEXT,
        details TEXT,
        timestamp TEXT
      )
    `);

    // Seed default users if table is empty
    db.get("SELECT count(*) as count FROM users", (err, row) => {
      if (row && row.count === 0) {
        console.log('Seeding default users...');
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('password123', salt);

        const defaultUsers = [
          {
            id: 'usr-admin-01',
            name: 'Sarah Connor',
            email: 'admin@thestackly.com',
            role: 'ADMIN',
            department: 'Executive',
            team: 'System Architecture',
            location: 'Global HQ',
            title: 'System Administrator',
            status: 'ACTIVE',
            permissions: JSON.stringify(["USER_CREATE", "USER_UPDATE", "USER_DELETE", "USER_MANAGE", "ROLE_CREATE", "ROLE_UPDATE", "ROLE_DELETE", "ROLE_MANAGE", "PERMISSION_ASSIGN", "EMPLOYEE_VIEW_ALL", "EMPLOYEE_CREATE", "EMPLOYEE_UPDATE", "EMPLOYEE_DELETE", "REPORT_VIEW_ALL", "REPORT_EXPORT", "SYSTEM_SETTINGS_MANAGE", "SYSTEM_CONFIG", "AUDIT_LOG_VIEW", "VIEW_ALL_DATA"])
          },
          {
            id: 'usr-hr-01',
            name: 'Elena Rostova',
            email: 'hr@thestackly.com',
            role: 'HR',
            department: 'Human Resources',
            team: 'People Operations',
            location: 'New York',
            title: 'VP of HR Operations',
            status: 'ACTIVE',
            permissions: JSON.stringify(["EMPLOYEE_VIEW", "EMPLOYEE_CREATE", "EMPLOYEE_UPDATE", "EMPLOYEE_PROFILE_MANAGE", "ATTENDANCE_VIEW_ALL", "ATTENDANCE_MANAGE", "LEAVE_APPROVE", "PERFORMANCE_MANAGE", "RECRUITMENT_MANAGE", "REPORT_GENERATE", "EMPLOYEE_MANAGE", "REPORT_VIEW"])
          },
          {
            id: 'usr-mgr-01',
            name: 'David Sterling',
            email: 'manager@thestackly.com',
            role: 'MANAGER',
            department: 'Engineering',
            team: 'Frontend & Backend',
            location: 'San Francisco',
            title: 'Department Manager',
            status: 'ACTIVE',
            permissions: JSON.stringify(["TEAM_VIEW", "TEAM_ANALYTICS_VIEW", "EMPLOYEE_VIEW_TEAM", "ATTENDANCE_VIEW_TEAM", "LEAVE_APPROVE", "PERFORMANCE_REVIEW", "TASK_ASSIGN", "REPORT_VIEW_TEAM"])
          },
          {
            id: 'usr-lead-01',
            name: 'Marcus Vance',
            email: 'lead@thestackly.com',
            role: 'TEAM_LEAD',
            department: 'Engineering',
            team: 'Frontend Team',
            location: 'San Francisco',
            title: 'Team Lead',
            status: 'ACTIVE',
            permissions: JSON.stringify(["TEAM_MEMBER_VIEW", "TEAM_VIEW", "TASK_ASSIGN", "TASK_TRACK", "ATTENDANCE_VIEW_TEAM", "PRODUCTIVITY_VIEW", "FEEDBACK_CREATE", "PERFORMANCE_FEEDBACK"])
          },
          {
            id: 'usr-emp-01',
            name: 'Alex Mercer',
            email: 'employee@thestackly.com',
            role: 'EMPLOYEE',
            department: 'Engineering',
            team: 'Frontend Team',
            location: 'San Francisco',
            title: 'Full Stack Developer',
            status: 'ACTIVE',
            permissions: JSON.stringify(["PROFILE_VIEW", "PROFILE_UPDATE", "ATTENDANCE_VIEW_SELF", "LEAVE_REQUEST", "PERFORMANCE_VIEW_SELF", "GOAL_UPDATE", "DOCUMENT_UPLOAD"])
          }
        ];

        const stmt = db.prepare(`
          INSERT INTO users (id, name, email, password_hash, role, department, team, location, title, status, permissions)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        defaultUsers.forEach((u) => {
          stmt.run(u.id, u.name, u.email, hash, u.role, u.department, u.team, u.location, u.title, u.status, u.permissions);
        });
        stmt.finalize();
        console.log('Seeding complete.');
      }
    });
  });
}
