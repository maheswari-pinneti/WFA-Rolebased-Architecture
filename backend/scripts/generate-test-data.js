import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../database/wfa.db');

console.log(`Connecting to database at: ${dbPath}`);
const db = new sqlite3.Database(dbPath);

const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function onRun(err) {
    if (err) reject(err);
    else resolve(this);
  });
});

const all = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

// Seed configuration data helper arrays
const departments = [
  { name: 'Engineering', target: 80, teams: ['Frontend Team', 'Backend Core', 'DevOps & Infra', 'QA Automation'] },
  { name: 'Sales & Marketing', target: 80, teams: ['Growth Team', 'Enterprise Sales', 'Inbound Sales', 'Brand & Creative'] }, // engineering: 80, sales: 55, marketing: 25 -> merged Sales & Marketing (80)
  { name: 'Operations', target: 45, teams: ['Logistics Ops', 'Delivery Support', 'Vendor Coordination'] },
  { name: 'Finance & Admin', target: 45, teams: ['Finance Operations', 'Global Procurement', 'Real Estate Ops'] }, // finance: 30, admin: 15 -> Finance & Admin (45)
  { name: 'Human Resources', target: 25, teams: ['People Operations', 'Talent Acquisition', 'Compensation'] },
  { name: 'Customer Success', target: 50, teams: ['Premium Accounts', 'Support Tier-1', 'Support Tier-2'] } // IT: 25 + CS: 25 -> Customer Success (50)
];

const statuses = ['ACTIVE', 'ON_LEAVE', 'NOTICE_PERIOD', 'INACTIVE', 'TERMINATED'];
const statusDistribution = [
  ...Array(260).fill('ACTIVE'),
  ...Array(15).fill('ON_LEAVE'),
  ...Array(10).fill('NOTICE_PERIOD'),
  ...Array(10).fill('INACTIVE'),
  ...Array(5).fill('TERMINATED')
];

const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];

function generateName() {
  const f = firstNames[Math.floor(Math.random() * firstNames.length)];
  const l = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${f} ${l}`;
}

async function main() {
  try {
    console.log('Clearing existing database records...');
    await run('DELETE FROM users');
    await run('DELETE FROM employees');
    await run('DELETE FROM attendance_records');
    await run('DELETE FROM leave_requests');
    await run('DELETE FROM audit_logs');
    await run('DELETE FROM performance_records');
    await run('DELETE FROM skills');

    console.log('Generating 300 employees and relational hierarchy...');
    const employeesList = [];
    const passwordHash = '$2b$10$evn.6.RBuIQsGMgA5MxGtuJl6S8cQJ76ObN8TfMzIDd14QLGeqH5S'; // Default password: admin

    // 1. Create 1 Admin
    const adminName = 'System Administrator';
    employeesList.push({
      id: 'usr-admin-01',
      employeeCode: 'STK-ADMIN-01',
      name: adminName,
      email: 'admin@thestackly.com',
      role: 'ADMIN',
      department: 'Executive',
      designation: 'VP of System Architecture',
      status: 'ACTIVE',
      joinDate: '2023-01-15',
      performanceScore: 98,
      attendanceRate: 99,
      team: 'Executive Board',
      salary: 180000,
      clearanceLevel: 5,
      permissions: ['USER_CREATE', 'USER_UPDATE', 'USER_DELETE', 'USER_MANAGE', 'ROLE_CREATE', 'ROLE_UPDATE', 'ROLE_DELETE', 'ROLE_MANAGE', 'PERMISSION_ASSIGN', 'EMPLOYEE_VIEW_ALL', 'EMPLOYEE_CREATE', 'EMPLOYEE_UPDATE', 'EMPLOYEE_DELETE', 'REPORT_VIEW_ALL', 'REPORT_EXPORT', 'SYSTEM_SETTINGS_MANAGE', 'SYSTEM_CONFIG', 'AUDIT_LOG_VIEW', 'VIEW_ALL_DATA']
    });

    // 2. Create 5 HR Managers
    const hrManagers = [];
    for (let i = 1; i <= 5; i++) {
      const name = generateName();
      const id = `usr-hr-0${i}`;
      hrManagers.push({
        id,
        employeeCode: `STK-HR-0${i}`,
        name,
        email: `${name.toLowerCase().replace(' ', '.')}@thestackly.com`,
        role: 'HR',
        department: 'Human Resources',
        designation: 'HR Operations Manager',
        status: 'ACTIVE',
        joinDate: '2024-03-10',
        performanceScore: 88 + i,
        attendanceRate: 96,
        team: 'People Operations',
        salary: 95000,
        clearanceLevel: 4,
        permissions: ['EMPLOYEE_VIEW', 'EMPLOYEE_CREATE', 'EMPLOYEE_UPDATE', 'EMPLOYEE_PROFILE_MANAGE', 'ATTENDANCE_VIEW_ALL', 'ATTENDANCE_MANAGE', 'LEAVE_APPROVE', 'PERFORMANCE_MANAGE', 'RECRUITMENT_MANAGE', 'REPORT_GENERATE', 'EMPLOYEE_MANAGE', 'REPORT_VIEW', 'TEAM_ANALYTICS_VIEW']
      });
    }
    employeesList.push(...hrManagers);

    // 3. Create Managers for each department (15 Managers total distributed)
    const deptManagers = {};
    let managerCounter = 1;
    departments.forEach(dept => {
      deptManagers[dept.name] = [];
      const numManagers = dept.name === 'Engineering' || dept.name === 'Sales & Marketing' ? 3 : 2;
      for (let m = 0; m < numManagers; m++) {
        const name = generateName();
        const id = `usr-mgr-0${managerCounter}`;
        const mgrRecord = {
          id,
          employeeCode: `STK-MGR-0${managerCounter}`,
          name,
          email: `${name.toLowerCase().replace(' ', '.')}@thestackly.com`,
          role: 'MANAGER',
          department: dept.name,
          designation: 'Department Manager',
          status: 'ACTIVE',
          joinDate: '2023-08-01',
          performanceScore: 85 + Math.floor(Math.random() * 10),
          attendanceRate: 94 + Math.floor(Math.random() * 5),
          team: dept.teams[0],
          salary: 120000,
          clearanceLevel: 3,
          permissions: ['TEAM_VIEW', 'TEAM_ANALYTICS_VIEW', 'EMPLOYEE_VIEW_TEAM', 'ATTENDANCE_VIEW_TEAM', 'LEAVE_APPROVE', 'PERFORMANCE_REVIEW', 'TASK_ASSIGN', 'REPORT_VIEW_TEAM']
        };
        deptManagers[dept.name].push(mgrRecord);
        employeesList.push(mgrRecord);
        managerCounter++;
      }
    });

    // 4. Create 30 Team Leads
    const teamLeads = {};
    let leadCounter = 1;
    departments.forEach(dept => {
      teamLeads[dept.name] = [];
      dept.teams.forEach(team => {
        // Map one lead per team
        const name = generateName();
        const id = `usr-lead-0${leadCounter}`;
        const leadRecord = {
          id,
          employeeCode: `STK-LEAD-0${leadCounter}`,
          name,
          email: `${name.toLowerCase().replace(' ', '.')}@thestackly.com`,
          role: 'TEAM_LEAD',
          department: dept.name,
          designation: 'Team Lead',
          status: 'ACTIVE',
          joinDate: '2024-06-01',
          performanceScore: 82 + Math.floor(Math.random() * 12),
          attendanceRate: 93 + Math.floor(Math.random() * 6),
          team,
          salary: 85000,
          clearanceLevel: 2,
          permissions: ['TEAM_MEMBER_VIEW', 'TEAM_VIEW', 'TASK_ASSIGN', 'TASK_TRACK', 'ATTENDANCE_VIEW_TEAM', 'PRODUCTIVITY_VIEW', 'FEEDBACK_CREATE', 'PERFORMANCE_FEEDBACK']
        };
        teamLeads[dept.name].push(leadRecord);
        employeesList.push(leadRecord);
        leadCounter++;
      });
    });

    // 5. Create 249 regular Employees
    let empCounter = 1;
    departments.forEach(dept => {
      // engineering target: 80, Sales & Marketing: 80, CS: 50, etc.
      // Distribute remaining slots to match target sizes
      const currentLeadsManagersCount = (deptManagers[dept.name]?.length || 0) + (teamLeads[dept.name]?.length || 0);
      const remainingTarget = dept.target - currentLeadsManagersCount;
      
      for (let e = 0; e < remainingTarget; e++) {
        const name = generateName();
        const id = `usr-emp-${empCounter.toString().padStart(3, '0')}`;
        const teamSelected = dept.teams[e % dept.teams.length];
        const statusSelected = statusDistribution[empCounter % statusDistribution.length];

        const empRecord = {
          id,
          employeeCode: `STK-EMP-${empCounter.toString().padStart(3, '0')}`,
          name,
          email: `${name.toLowerCase().replace(' ', '.')}@thestackly.com`,
          role: 'EMPLOYEE',
          department: dept.name,
          designation: 'Full Stack Developer',
          status: statusSelected,
          joinDate: `2025-${(empCounter % 12 + 1).toString().padStart(2, '0')}-15`,
          performanceScore: 60 + Math.floor(Math.random() * 38),
          attendanceRate: 80 + Math.floor(Math.random() * 20),
          team: teamSelected,
          salary: 60000 + Math.floor(Math.random() * 20000),
          clearanceLevel: 1,
          permissions: ['PROFILE_VIEW', 'PROFILE_UPDATE', 'ATTENDANCE_VIEW_SELF', 'LEAVE_REQUEST', 'PERFORMANCE_VIEW_SELF', 'GOAL_UPDATE', 'DOCUMENT_UPLOAD']
        };
        employeesList.push(empRecord);
        empCounter++;
      }
    });

    console.log(`Prepared ${employeesList.length} employee objects. Inserting into SQLite database...`);

    const insertUserStmt = db.prepare(`INSERT INTO users (id, name, email, password_hash, role, department, team, location, title, clearanceLevel, status, permissions, mfa_enabled, organizationId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'org-stackly')`);
    const insertEmpStmt = db.prepare(`INSERT INTO employees (id, employeeCode, name, email, role, department, designation, status, avatar, joinDate, performanceScore, attendanceRate, team, organizationId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'org-stackly')`);

    for (const emp of employeesList) {
      insertUserStmt.run([
        emp.id,
        emp.name,
        emp.email,
        passwordHash,
        emp.role,
        emp.department,
        emp.team,
        'Bengaluru Office',
        emp.designation,
        emp.clearanceLevel,
        emp.status,
        JSON.stringify(emp.permissions)
      ]);

      insertEmpStmt.run([
        emp.id,
        emp.employeeCode,
        emp.name,
        emp.email,
        emp.role,
        emp.department,
        emp.designation,
        emp.status,
        `https://api.dicebear.com/7.x/adventurer/svg?seed=${emp.name.replace(' ', '')}`,
        emp.joinDate,
        emp.performanceScore,
        emp.attendanceRate,
        emp.team
      ]);
    }

    insertUserStmt.finalize();
    insertEmpStmt.finalize();

    console.log('Employees successfully seeded! Generating historical data...');

    // 6. Generate 9,000 Attendance records (30 days of history)
    console.log('Seeding 9,000 attendance history logs...');
    const attendanceInsert = db.prepare(`INSERT INTO attendance_records (id, employeeId, employeeName, department, date, checkInTime, checkOutTime, breaks, shiftType, workMode, status, latitude, longitude, accuracy, idempotencyKey, team, organizationId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'org-stackly')`);
    
    const today = new Date();
    let attRecordsCount = 0;
    
    for (let dayOffset = 30; dayOffset >= 0; dayOffset--) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() - dayOffset);
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
      if (isWeekend) continue; // Skip weekend logs for realistic workforce cycles

      const dateStr = currentDate.toISOString().split('T')[0];

      for (const emp of employeesList) {
        if (emp.role === 'ADMIN' || emp.status === 'TERMINATED') continue;

        // Skip random days or leaves
        const skipRoll = Math.random();
        if (skipRoll < 0.05) continue; // Absent roll

        const isLate = Math.random() < 0.15;
        const isHalfDay = Math.random() < 0.04;
        const workMode = Math.random() < 0.3 ? 'Remote' : 'Office';

        let checkInHour = 8;
        let checkInMinute = 30 + Math.floor(Math.random() * 28); // 8:30 to 8:58
        if (isLate) {
          checkInHour = 9;
          checkInMinute = 16 + Math.floor(Math.random() * 45); // 9:16 to 10:00
        }

        const checkInTimeStr = new Date(currentDate);
        checkInTimeStr.setHours(checkInHour, checkInMinute, 0);

        const checkOutTimeStr = new Date(currentDate);
        if (isHalfDay) {
          checkOutTimeStr.setHours(13, 0 + Math.floor(Math.random() * 30), 0);
        } else {
          checkOutTimeStr.setHours(17, 30 + Math.floor(Math.random() * 90), 0);
        }

        const recordId = `att-${Math.random().toString(36).slice(2, 11)}`;
        const status = isHalfDay ? 'Half Day' : 'Checked Out';

        attendanceInsert.run([
          recordId,
          emp.id,
          emp.name,
          emp.department,
          dateStr,
          checkInTimeStr.toISOString(),
          checkOutTimeStr.toISOString(),
          '[]',
          'Regular',
          workMode,
          status,
          12.9716 + (Math.random() - 0.5) * 0.001,
          77.5946 + (Math.random() - 0.5) * 0.001,
          15,
          `idemp-${recordId}`,
          emp.team
        ]);

        attRecordsCount++;
      }
    }
    attendanceInsert.finalize();
    console.log(`Generated ${attRecordsCount} attendance records.`);

    // 7. Generate 1,000 Leave records
    console.log('Seeding 1,000 leaves history...');
    const leaveInsert = db.prepare(`INSERT INTO leave_requests (id, employeeId, employeeName, department, team, organizationId, type, startDate, endDate, reason, status, reviewedBy, reviewComment, createdAt) VALUES (?, ?, ?, ?, ?, 'org-stackly', ?, ?, ?, ?, ?, ?, ?, ?)`);
    
    for (let l = 1; l <= 1000; l++) {
      const emp = employeesList[Math.floor(Math.random() * employeesList.length)];
      if (emp.role === 'ADMIN') continue;

      const leaveTypes = ['Annual Leave', 'Sick Leave', 'Maternity Leave', 'Paternity Leave', 'Casual Leave'];
      const leaveStatuses = ['APPROVED', 'REJECTED', 'PENDING'];
      
      const type = leaveTypes[l % leaveTypes.length];
      const status = leaveStatuses[l % leaveStatuses.length];
      
      const startDate = new Date(today);
      startDate.setDate(today.getDate() + (Math.floor(Math.random() * 40) - 20));
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + (1 + Math.floor(Math.random() * 5)));

      const id = `leave-${Date.now()}-${l}-${Math.random().toString(36).slice(2, 6)}`;
      const reviewer = status !== 'PENDING' ? 'Elena Rostova' : null;

      leaveInsert.run([
        id,
        emp.id,
        emp.name,
        emp.department,
        emp.team,
        type,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        'Integration and testing leave request simulation.',
        status,
        reviewer,
        status !== 'PENDING' ? 'System processed approval code.' : null,
        new Date().toISOString()
      ]);
    }
    leaveInsert.finalize();

    // 8. Generate 500+ notifications
    console.log('Seeding 500+ notifications...');
    const notifInsert = db.prepare(`INSERT INTO tasks (id, title, assigneeId, assigneeName, department, team, organizationId, priority, status, points, updatedAt) VALUES (?, ?, ?, ?, ?, ?, 'org-stackly', ?, ?, ?, ?)`);
    
    for (let t = 1; t <= 500; t++) {
      const emp = employeesList[Math.floor(Math.random() * employeesList.length)];
      const priorities = ['HIGH', 'MEDIUM', 'LOW'];
      const taskStatuses = ['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'];

      notifInsert.run([
        `tsk-${t}-${Math.random().toString(36).slice(2, 6)}`,
        `Complete performance audit checklist #${t}`,
        emp.id,
        emp.name,
        emp.department,
        emp.team,
        priorities[t % priorities.length],
        taskStatuses[t % taskStatuses.length],
        5,
        new Date().toISOString()
      ]);
    }
    notifInsert.finalize();

    // 9. Generate 1,000+ Audit Logs
    console.log('Seeding 1,000+ audit logs...');
    const auditInsert = db.prepare(`INSERT INTO audit_logs (id, timestamp, employeeId, action, details, organizationId) VALUES (?, ?, ?, ?, ?, 'org-stackly')`);
    const actionsList = ['LOGIN', 'CHECK_IN', 'CHECK_OUT', 'LEAVE_REQUESTED', 'MFA_CHALLENGE', 'LOGOUT'];

    for (let aLog = 1; aLog <= 1200; aLog++) {
      const emp = employeesList[Math.floor(Math.random() * employeesList.length)];
      const action = actionsList[aLog % actionsList.length];
      const id = `aud-${aLog}-${Math.random().toString(36).slice(2, 6)}`;

      auditInsert.run([
        id,
        new Date(today.getTime() - Math.floor(Math.random() * 86400000 * 30)).toISOString(),
        emp.id,
        action,
        `Audit logger activity capture event simulation code: ${action}`,
      ]);
    }
    auditInsert.finalize();

    console.log('\n=========================================');
    console.log('⚡ DATABASE GENERATION COMPLETE!');
    console.log(`Seeded Employees: ${employeesList.length}`);
    console.log(`Seeded Attendance Logs: ${attRecordsCount}`);
    console.log('=========================================\n');

    db.close();
  } catch (err) {
    console.error('Data generation failed:', err);
  }
}

main();
