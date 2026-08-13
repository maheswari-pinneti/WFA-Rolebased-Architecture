import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbDir = path.join(__dirname, '..', '..', '..', 'database');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const ORGANIZATION_ID = 'org-stackly';
const dbName = process.env.DB_NAME || 'wfa.db';
const dbPath = path.join(dbDir, dbName);
const db = new sqlite3.Database(dbPath);

const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function onRun(err) {
    if (err) reject(err);
    else resolve(this);
  });
});

const get = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
});

const all = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
});

const prepareAndRun = (sql, rows) => new Promise((resolve, reject) => {
  const statement = db.prepare(sql, (prepareError) => {
    if (prepareError) reject(prepareError);
  });

  rows.forEach((row) => statement.run(row));
  statement.finalize((finalizeError) => (finalizeError ? reject(finalizeError) : resolve()));
});

const ensureColumn = async (table, column, definition) => {
  const columns = await all(`PRAGMA table_info(${table})`);
  if (!columns.some((item) => item.name === column)) {
    await run(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
};

const createSchema = async () => {
  await run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    role TEXT NOT NULL,
    department TEXT,
    team TEXT,
    location TEXT,
    title TEXT,
    clearanceLevel INTEGER DEFAULT 1,
    status TEXT DEFAULT 'ACTIVE',
    permissions TEXT DEFAULT '[]',
    mfa_enabled INTEGER DEFAULT 1,
    organizationId TEXT DEFAULT '${ORGANIZATION_ID}'
  )`);

  await run(`CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    employeeCode TEXT UNIQUE,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    role TEXT,
    department TEXT,
    designation TEXT,
    status TEXT,
    avatar TEXT,
    joinDate TEXT,
    performanceScore REAL,
    attendanceRate REAL,
    team TEXT,
    location TEXT,
    organizationId TEXT DEFAULT '${ORGANIZATION_ID}'
  )`);

  await run(`CREATE TABLE IF NOT EXISTS attendance_records (
    id TEXT PRIMARY KEY,
    employeeId TEXT NOT NULL,
    employeeName TEXT,
    department TEXT,
    date TEXT,
    checkInTime TEXT,
    checkOutTime TEXT,
    breaks TEXT DEFAULT '[]',
    shiftType TEXT,
    workMode TEXT,
    status TEXT,
    latitude REAL,
    longitude REAL,
    accuracy REAL,
    idempotencyKey TEXT UNIQUE,
    team TEXT,
    organizationId TEXT DEFAULT '${ORGANIZATION_ID}'
  )`);

  await run(`CREATE TABLE IF NOT EXISTS corrections (
    id TEXT PRIMARY KEY,
    employeeId TEXT NOT NULL,
    employeeName TEXT,
    department TEXT,
    date TEXT,
    requestedCheckIn TEXT,
    requestedCheckOut TEXT,
    reason TEXT,
    status TEXT,
    managerComment TEXT,
    reviewedBy TEXT,
    createdAt TEXT,
    team TEXT,
    organizationId TEXT DEFAULT '${ORGANIZATION_ID}'
  )`);

  await run(`CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT,
    employeeId TEXT,
    action TEXT,
    details TEXT,
    organizationId TEXT DEFAULT '${ORGANIZATION_ID}'
  )`);

  await run(`CREATE TABLE IF NOT EXISTS mfa_challenges (
    email TEXT PRIMARY KEY,
    otp_hash TEXT,
    expires_at TEXT,
    attempts_count INTEGER DEFAULT 0,
    created_at TEXT,
    status TEXT
  )`);

  await run(`CREATE TABLE IF NOT EXISTS shifts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    startTime TEXT,
    endTime TEXT,
    gracePeriodMinutes INTEGER DEFAULT 0,
    organizationId TEXT DEFAULT '${ORGANIZATION_ID}'
  )`);

  await run(`CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    employeeId TEXT NOT NULL,
    skillName TEXT NOT NULL,
    level INTEGER,
    isTopSkill INTEGER DEFAULT 0,
    isMissingSkill INTEGER DEFAULT 0,
    department TEXT,
    team TEXT,
    organizationId TEXT DEFAULT '${ORGANIZATION_ID}'
  )`);

  await run(`CREATE TABLE IF NOT EXISTS performance_records (
    id TEXT PRIMARY KEY,
    employeeId TEXT NOT NULL,
    quarter TEXT,
    kpiScore REAL,
    targetScore REAL,
    productivityScore REAL,
    department TEXT,
    team TEXT,
    organizationId TEXT DEFAULT '${ORGANIZATION_ID}'
  )`);

  await run(`CREATE TABLE IF NOT EXISTS leave_requests (
    id TEXT PRIMARY KEY,
    employeeId TEXT NOT NULL,
    employeeName TEXT,
    department TEXT,
    team TEXT,
    organizationId TEXT DEFAULT '${ORGANIZATION_ID}',
    type TEXT,
    startDate TEXT,
    endDate TEXT,
    reason TEXT,
    status TEXT DEFAULT 'PENDING',
    reviewedBy TEXT,
    reviewComment TEXT,
    createdAt TEXT
  )`);

  await run(`CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    assigneeId TEXT,
    assigneeName TEXT,
    department TEXT,
    team TEXT,
    organizationId TEXT DEFAULT '${ORGANIZATION_ID}',
    priority TEXT,
    status TEXT,
    points INTEGER DEFAULT 0,
    updatedAt TEXT
  )`);

  // Add columns to databases created by earlier versions without destroying data.
  await ensureColumn('users', 'organizationId', `TEXT DEFAULT '${ORGANIZATION_ID}'`);
  await ensureColumn('employees', 'team', 'TEXT');
  await ensureColumn('employees', 'location', 'TEXT');
  await ensureColumn('employees', 'organizationId', `TEXT DEFAULT '${ORGANIZATION_ID}'`);
  await ensureColumn('attendance_records', 'team', 'TEXT');
  await ensureColumn('attendance_records', 'organizationId', `TEXT DEFAULT '${ORGANIZATION_ID}'`);
  await ensureColumn('corrections', 'team', 'TEXT');
  await ensureColumn('corrections', 'organizationId', `TEXT DEFAULT '${ORGANIZATION_ID}'`);
  await ensureColumn('audit_logs', 'organizationId', `TEXT DEFAULT '${ORGANIZATION_ID}'`);
  await ensureColumn('shifts', 'organizationId', `TEXT DEFAULT '${ORGANIZATION_ID}'`);
  await ensureColumn('skills', 'department', 'TEXT');
  await ensureColumn('skills', 'team', 'TEXT');
  await ensureColumn('skills', 'organizationId', `TEXT DEFAULT '${ORGANIZATION_ID}'`);
  await ensureColumn('performance_records', 'productivityScore', 'REAL');
  await ensureColumn('performance_records', 'department', 'TEXT');
  await ensureColumn('performance_records', 'team', 'TEXT');
  await ensureColumn('performance_records', 'organizationId', `TEXT DEFAULT '${ORGANIZATION_ID}'`);

  await run(`UPDATE users SET organizationId = ? WHERE organizationId IS NULL`, [ORGANIZATION_ID]);
  await run(`UPDATE employees SET organizationId = ? WHERE organizationId IS NULL`, [ORGANIZATION_ID]);
  await run(`UPDATE employees SET team = CASE department
    WHEN 'Engineering' THEN 'Frontend Team'
    WHEN 'Product Management' THEN 'Product Strategy'
    WHEN 'Sales & Marketing' THEN 'Growth Team'
    WHEN 'Human Resources' THEN 'People Operations'
    WHEN 'Customer Success' THEN 'Customer Success'
    ELSE 'Finance Operations' END WHERE team IS NULL`);
  await run(`UPDATE attendance_records SET organizationId = ? WHERE organizationId IS NULL`, [ORGANIZATION_ID]);
  await run(`UPDATE corrections SET organizationId = ? WHERE organizationId IS NULL`, [ORGANIZATION_ID]);
  await run(`UPDATE audit_logs SET organizationId = ? WHERE organizationId IS NULL`, [ORGANIZATION_ID]);
  await run(`UPDATE shifts SET organizationId = ? WHERE organizationId IS NULL`, [ORGANIZATION_ID]);
  await run(`UPDATE skills SET organizationId = ? WHERE organizationId IS NULL`, [ORGANIZATION_ID]);
  await run(`UPDATE performance_records SET organizationId = ? WHERE organizationId IS NULL`, [ORGANIZATION_ID]);
};

const seedCoreUsers = async () => {
  const row = await get('SELECT COUNT(*) AS count FROM users');
  if (row.count > 0) return;

  const passHash = '$2b$10$evn.6.RBuIQsGMgA5MxGtuJl6S8cQJ76ObN8TfMzIDd14QLGeqH5S';
  const users = [
    ['usr-admin-01', 'Sarah Connor', 'admin@thestackly.com', 'ADMIN', 'Executive', 'System Architecture', 'Global HQ', 'System Administrator', 5, ['USER_CREATE', 'USER_UPDATE', 'USER_DELETE', 'USER_MANAGE', 'ROLE_CREATE', 'ROLE_UPDATE', 'ROLE_DELETE', 'ROLE_MANAGE', 'PERMISSION_ASSIGN', 'EMPLOYEE_VIEW_ALL', 'EMPLOYEE_CREATE', 'EMPLOYEE_UPDATE', 'EMPLOYEE_DELETE', 'REPORT_VIEW_ALL', 'REPORT_EXPORT', 'SYSTEM_SETTINGS_MANAGE', 'SYSTEM_CONFIG', 'AUDIT_LOG_VIEW', 'VIEW_ALL_DATA']],
    ['usr-hr-01', 'Elena Rostova', 'hr@thestackly.com', 'HR', 'Human Resources', 'People Operations', 'New York', 'VP of HR Operations', 4, ['EMPLOYEE_VIEW', 'EMPLOYEE_CREATE', 'EMPLOYEE_UPDATE', 'EMPLOYEE_PROFILE_MANAGE', 'ATTENDANCE_VIEW_ALL', 'ATTENDANCE_MANAGE', 'LEAVE_APPROVE', 'PERFORMANCE_MANAGE', 'RECRUITMENT_MANAGE', 'REPORT_GENERATE', 'EMPLOYEE_MANAGE', 'REPORT_VIEW', 'TEAM_ANALYTICS_VIEW']],
    ['usr-mgr-01', 'David Sterling', 'manager@thestackly.com', 'MANAGER', 'Engineering', 'Frontend & Backend', 'San Francisco', 'Department Manager', 3, ['TEAM_VIEW', 'TEAM_ANALYTICS_VIEW', 'EMPLOYEE_VIEW_TEAM', 'ATTENDANCE_VIEW_TEAM', 'LEAVE_APPROVE', 'PERFORMANCE_REVIEW', 'TASK_ASSIGN', 'REPORT_VIEW_TEAM']],
    ['usr-lead-01', 'Marcus Vance', 'lead@thestackly.com', 'TEAM_LEAD', 'Engineering', 'Frontend Team', 'San Francisco', 'Team Lead', 2, ['TEAM_MEMBER_VIEW', 'TEAM_VIEW', 'TASK_ASSIGN', 'TASK_TRACK', 'ATTENDANCE_VIEW_TEAM', 'PRODUCTIVITY_VIEW', 'FEEDBACK_CREATE', 'PERFORMANCE_FEEDBACK']]
  ];

  await prepareAndRun(
    `INSERT OR IGNORE INTO users (id,name,email,password_hash,role,department,team,location,title,clearanceLevel,status,permissions,mfa_enabled,organizationId)
     VALUES (?,?,?,?,?,?,?,?,?,?,?, ?,1,?)`,
    users.map((u) => [u[0], u[1], u[2], passHash, u[3], u[4], u[5], u[6], u[7], u[8], 'ACTIVE', JSON.stringify(u[9]), ORGANIZATION_ID])
  );
};

const seedEmployees = async () => {
  // Clear any previously generated employees and users with EMPLOYEE role
  await run("DELETE FROM employees");
  await run("DELETE FROM users WHERE role = 'EMPLOYEE'");
  await run("DELETE FROM departments");
  await run("DELETE FROM teams");
  await run("DELETE FROM skills");
  await run("DELETE FROM performance_records");
  await run("DELETE FROM organizations");

  const passHash = '$2b$10$evn.6.RBuIQsGMgA5MxGtuJl6S8cQJ76ObN8TfMzIDd14QLGeqH5S';
  const departments = ['Engineering', 'Product Management', 'Sales & Marketing', 'Human Resources', 'Customer Success', 'Finance & Operations'];
  const teams = ['Frontend Team', 'Product Strategy', 'Growth Team', 'People Operations', 'Customer Success', 'Finance Operations'];
  const designations = ['Senior Software Engineer', 'Product Manager', 'Account Executive', 'HR Operations Manager', 'Customer Success Director', 'Financial Analyst'];
  const statuses = ['ACTIVE', 'REMOTE', 'ON_LEAVE', 'ACTIVE'];

  // Geographic distribution: Hyderabad: 70, Visakhapatnam: 40, Chennai: 50, Bengaluru: 60, Kochi: 30
  const locations = [];
  for (let i = 0; i < 70; i++) locations.push('Hyderabad');
  for (let i = 0; i < 40; i++) locations.push('Visakhapatnam');
  for (let i = 0; i < 50; i++) locations.push('Chennai');
  for (let i = 0; i < 60; i++) locations.push('Bengaluru');
  for (let i = 0; i < 30; i++) locations.push('Kochi');

  const firstNames = [
    'Aarav', 'Vihaan', 'Vivaan', 'Ananya', 'Diya', 'Advik', 'Siddharth', 'Ishaan', 'Aanya', 'Aditi',
    'Kabir', 'Rohan', 'Arjun', 'Rahul', 'Pranav', 'Aditya', 'Sai', 'Krishna', 'Karan', 'Sanjay',
    'Vikram', 'Ramesh', 'Suresh', 'Anil', 'Sunil', 'Vijay', 'Rajesh', 'Harish', 'Manish', 'Amit',
    'Pooja', 'Neha', 'Priya', 'Sneha', 'Anjali', 'Riya', 'Divya', 'Deepika', 'Kiran', 'Jyoti',
    'Akash', 'Abhishek', 'Aman', 'Aniket', 'Ayush', 'Gaurav', 'Nitin', 'Pankaj', 'Sachin', 'Sandeep',
    'Shalini', 'Swati', 'Meera', 'Shruti', 'Preeti', 'Kavita', 'Geeta', 'Lata', 'Sunita', 'Anita'
  ];
  const lastNames = [
    'Sharma', 'Verma', 'Kumar', 'Singh', 'Patel', 'Reddy', 'Rao', 'Nair', 'Pillai', 'Joshi',
    'Iyer', 'Iyengar', 'Gupta', 'Sen', 'Dutta', 'Das', 'Banerjee', 'Chatterjee', 'Mukherjee', 'Bose',
    'Mehta', 'Shah', 'Trivedi', 'Pandey', 'Mishra', 'Choudhury', 'Prasad', 'Sinha', 'Kapoor', 'Khanna',
    'Malhotra', 'Bahl', 'Gill', 'Sandhu', 'Nayar', 'Menon', 'Shetty', 'Hegde', 'Gowda', 'Naidu'
  ];

  const empRows = [];
  const userRows = [];

  for (let i = 1; i <= 250; i++) {
    const id = i === 250 ? 'usr-emp-01' : `emp-${i}`;
    const paddedNum = String(i).padStart(4, '0');
    const joiningYear = 2020 + (i % 7);
    const code = `STK-${joiningYear}-${paddedNum}`;
    
    const firstName = firstNames[(i - 1) % firstNames.length];
    const lastName = lastNames[Math.floor((i - 1) / firstNames.length) % lastNames.length];

    const name = i === 250 ? 'Alex Mercer' : `${firstName} ${lastName}`;
    const email = i === 250 ? 'employee@thestackly.com' : `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${paddedNum}@thestackly.com`;
    const role = 'EMPLOYEE';
    const deptIdx = i % departments.length;
    const dept = i === 250 ? 'Engineering' : departments[deptIdx];
    const design = i === 250 ? 'Full Stack Developer' : designations[deptIdx];
    const status = statuses[i % statuses.length];
    const team = i === 250 ? 'Frontend Team' : teams[deptIdx];
    const location = locations[i - 1];

    empRows.push([
      id, code, name, email, role, dept, design, status,
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      `${joiningYear}-${String((i % 12) + 1).padStart(2, '0')}-15`, 80 + (i % 20), 90 + (i % 10),
      team, location, ORGANIZATION_ID
    ]);

    const perms = ['PROFILE_VIEW', 'PROFILE_UPDATE', 'ATTENDANCE_VIEW_SELF', 'LEAVE_REQUEST', 'PERFORMANCE_VIEW_SELF', 'GOAL_UPDATE', 'DOCUMENT_UPLOAD'];
    userRows.push([
      id, name, email, passHash, role, dept, team, location, design, 1, 'ACTIVE', JSON.stringify(perms), ORGANIZATION_ID
    ]);
  }

  await prepareAndRun(
    `INSERT OR IGNORE INTO employees (id,employeeCode,name,email,role,department,designation,status,avatar,joinDate,performanceScore,attendanceRate,team,location,organizationId)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    empRows
  );

  await prepareAndRun(
    `INSERT OR IGNORE INTO users (id,name,email,password_hash,role,department,team,location,title,clearanceLevel,status,permissions,mfa_enabled,organizationId)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,1,?)`,
    userRows
  );
};

const syncUserEmployeeProfiles = async () => {
  // No-op: We seed them directly in both users and employees tables.
};

const seedReferenceData = async () => {
  const orgCount = await get('SELECT COUNT(*) AS count FROM organizations');
  if (orgCount.count === 0) {
    await run(`INSERT OR IGNORE INTO organizations (id, name, domain, status) VALUES (?,?,?,?)`, ['org-stackly', 'Stackly Enterprise HQ', 'thestackly.com', 'ACTIVE']);
  }

  const deptCount = await get('SELECT COUNT(*) AS count FROM departments');
  if (deptCount.count === 0) {
    await prepareAndRun(
      `INSERT OR IGNORE INTO departments (id, name, code, managerId, organizationId) VALUES (?,?,?,?,?)`,
      [
        ['dept-eng', 'Engineering', 'ENG', 'usr-mgr-01', 'org-stackly'],
        ['dept-prod', 'Product Management', 'PROD', null, 'org-stackly'],
        ['dept-sales', 'Sales & Marketing', 'SALES', null, 'org-stackly'],
        ['dept-hr', 'Human Resources', 'HR', 'usr-hr-01', 'org-stackly'],
        ['dept-cs', 'Customer Success', 'CS', null, 'org-stackly'],
        ['dept-fin', 'Finance & Operations', 'FIN', null, 'org-stackly']
      ]
    );
  }

  const teamCount = await get('SELECT COUNT(*) AS count FROM teams');
  if (teamCount.count === 0) {
    await prepareAndRun(
      `INSERT OR IGNORE INTO teams (id, name, departmentId, leadId, organizationId) VALUES (?,?,?,?,?)`,
      [
        ['team-frontend', 'Frontend Team', 'dept-eng', 'usr-lead-01', 'org-stackly'],
        ['team-strategy', 'Product Strategy', 'dept-prod', null, 'org-stackly'],
        ['team-growth', 'Growth Team', 'dept-sales', null, 'org-stackly'],
        ['team-peops', 'People Operations', 'dept-hr', 'usr-hr-01', 'org-stackly'],
        ['team-cs', 'Customer Success', 'dept-cs', null, 'org-stackly'],
        ['team-finance', 'Finance Operations', 'dept-fin', null, 'org-stackly']
      ]
    );
  }

  const shiftCount = await get('SELECT COUNT(*) AS count FROM shifts');
  if (shiftCount.count === 0) {
    await prepareAndRun(
      `INSERT OR IGNORE INTO shifts (id,name,startTime,endTime,gracePeriodMinutes,organizationId) VALUES (?,?,?,?,?,?)`,
      [
        ['shift-regular', 'Regular', '09:00', '18:00', 15, ORGANIZATION_ID],
        ['shift-flexible', 'Flexible', '00:00', '23:59', 0, ORGANIZATION_ID],
        ['shift-overnight', 'Overnight', '21:00', '06:00', 15, ORGANIZATION_ID]
      ]
    );
  }

  const employeeRows = await all('SELECT id, department, team FROM employees WHERE organizationId = ?', [ORGANIZATION_ID]);
  const skillCount = await get('SELECT COUNT(*) AS count FROM skills');
  if (skillCount.count === 0) {
    const skills = ['React', 'TypeScript', 'Node.js', 'SQL', 'Cloud Architecture', 'Kubernetes', 'Data Analysis', 'Leadership'];
    const rows = [];
    employeeRows.forEach((employee, index) => {
      skills.slice(0, 5).forEach((skill, skillIndex) => {
        const level = 2 + ((index + skillIndex) % 4);
        rows.push([
          `skill-${index}-${skillIndex}`, employee.id, skill, level,
          level >= 4 ? 1 : 0, level <= 2 ? 1 : 0, employee.department, employee.team, ORGANIZATION_ID
        ]);
      });
    });
    await prepareAndRun(
      `INSERT OR IGNORE INTO skills (id,employeeId,skillName,level,isTopSkill,isMissingSkill,department,team,organizationId) VALUES (?,?,?,?,?,?,?,?,?)`,
      rows
    );
  }

  const performanceCount = await get('SELECT COUNT(*) AS count FROM performance_records');
  if (performanceCount.count === 0) {
    const rows = [];
    employeeRows.forEach((employee, index) => {
      ['Q1', 'Q2', 'Q3', 'Q4'].forEach((quarter, quarterIndex) => {
        const score = 72 + ((index + quarterIndex * 3) % 25);
        rows.push([
          `performance-${index}-${quarter}`, employee.id, quarter, score, 85,
          Math.min(100, score + 4), employee.department, employee.team, ORGANIZATION_ID
        ]);
      });
    });
    await prepareAndRun(
      `INSERT OR IGNORE INTO performance_records (id,employeeId,quarter,kpiScore,targetScore,productivityScore,department,team,organizationId) VALUES (?,?,?,?,?,?,?,?,?)`,
      rows
    );
  }

  // Existing databases may already have reference rows from before core user
  // profiles were mirrored into employees. Backfill only those new profiles.
  const userProfiles = await all(`SELECT id, department, team FROM employees WHERE id LIKE 'usr-%' AND organizationId = ?`, [ORGANIZATION_ID]);
  for (const employee of userProfiles) {
    const profileSkillCount = await get('SELECT COUNT(*) AS count FROM skills WHERE employeeId = ? AND organizationId = ?', [employee.id, ORGANIZATION_ID]);
    if (profileSkillCount.count === 0) {
      await prepareAndRun(
        `INSERT OR IGNORE INTO skills (id,employeeId,skillName,level,isTopSkill,isMissingSkill,department,team,organizationId) VALUES (?,?,?,?,?,?,?,?,?)`,
        ['React', 'TypeScript', 'Node.js', 'SQL', 'Leadership'].map((skill, index) => [`${employee.id}-skill-${index}`, employee.id, skill, 3 + (index % 3), index < 2 ? 1 : 0, index > 2 ? 1 : 0, employee.department, employee.team, ORGANIZATION_ID])
      );
    }
    const profilePerformanceCount = await get('SELECT COUNT(*) AS count FROM performance_records WHERE employeeId = ? AND organizationId = ?', [employee.id, ORGANIZATION_ID]);
    if (profilePerformanceCount.count === 0) {
      await prepareAndRun(
        `INSERT OR IGNORE INTO performance_records (id,employeeId,quarter,kpiScore,targetScore,productivityScore,department,team,organizationId) VALUES (?,?,?,?,?,?,?,?,?)`,
        ['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, index) => [`${employee.id}-performance-${quarter}`, employee.id, quarter, 85 + index, 85, 88 + index, employee.department, employee.team, ORGANIZATION_ID])
      );
    }
  }

  await run("DELETE FROM tasks WHERE id LIKE 'task-seed-%'");
  if (employeeRows.length > 0) {
    const taskTemplates = [
      ['Implement attendance export API', 'HIGH', 'IN_PROGRESS', 8],
      ['Review quarterly performance goals', 'MEDIUM', 'TODO', 5],
      ['Close accessibility findings', 'LOW', 'COMPLETED', 3],
      ['Validate department skill gaps', 'HIGH', 'TODO', 5]
    ];
    await prepareAndRun(
      `INSERT OR IGNORE INTO tasks (id,title,assigneeId,assigneeName,department,team,organizationId,priority,status,points,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      taskTemplates.map((task, index) => {
        const teamIndex = index % 6;
        const assignee = employeeRows.find(e => {
          const teams = ['Frontend Team', 'Product Strategy', 'Growth Team', 'People Operations', 'Customer Success', 'Finance Operations'];
          return e.team === teams[teamIndex];
        }) || employeeRows[index % employeeRows.length];
        return [`task-seed-${index + 1}`, task[0], assignee.id, assignee.name, assignee.department, assignee.team, ORGANIZATION_ID, task[1], task[2], task[3], new Date().toISOString()];
      })
    );
  }
};

const runSqlFile = async (filePath) => {
  const sql = fs.readFileSync(filePath, 'utf8');
  const statements = sql.split(';').map(s => s.trim()).filter(Boolean);
  for (const statement of statements) {
    await run(statement);
  }
};

let initPromise;
export const initDb = () => {
  if (!initPromise) {
    initPromise = (async () => {
      // 1. Run migrations SQL files
      const migrationsDir = path.join(dbDir, 'migrations');
      if (fs.existsSync(migrationsDir)) {
        const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
        for (const file of files) {
          await runSqlFile(path.join(migrationsDir, file));
        }
      }

      // 2. Run seeds SQL files (if users table is empty)
      const userCount = await get('SELECT COUNT(*) AS count FROM users').catch(() => ({ count: 0 }));
      if (userCount.count === 0) {
        const seedsDir = path.join(dbDir, 'seeds');
        if (fs.existsSync(seedsDir)) {
          const files = fs.readdirSync(seedsDir).filter(f => f.endsWith('.sql')).sort();
          for (const file of files) {
            await runSqlFile(path.join(seedsDir, file));
          }
        }
      }

      await run("BEGIN TRANSACTION");
      try {
        await createSchema();
        await seedCoreUsers();
        await seedEmployees();
        await syncUserEmployeeProfiles();
        await seedReferenceData();
        await run("COMMIT");
      } catch (err) {
        await run("ROLLBACK");
        throw err;
      }
      return true;
    })();
  }
  return initPromise;
};

export const logAudit = (userId, action, details, organizationId = ORGANIZATION_ID) => {
  const id = Math.random().toString(36).slice(2, 11);
  const timestamp = new Date().toISOString();
  db.run(
    `INSERT INTO audit_logs (id,timestamp,employeeId,action,details,organizationId) VALUES (?,?,?,?,?,?)`,
    [id, timestamp, userId, action, details, organizationId],
    (err) => {
      if (err) console.error('Failed to write audit log:', err);
    }
  );
};

export { ORGANIZATION_ID };
export default db;

const closeDb = () => {
  db.close((err) => {
    if (err) {
      if (err.message !== 'SQLITE_ERR_MISUSE' && !err.message.includes('closed')) {
        console.error('Error closing database on exit:', err.message);
      }
    }
  });
};

process.on('exit', closeDb);
process.on('SIGINT', () => {
  closeDb();
  process.exit(0);
});
process.on('SIGTERM', () => {
  closeDb();
  process.exit(0);
});
