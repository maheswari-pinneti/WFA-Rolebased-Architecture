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

const dbName = process.env.DB_NAME || 'wfa.db';
const dbPath = path.join(dbDir, dbName);
const db = new sqlite3.Database(dbPath);

export const initDb = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Create Users Table
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
          clearanceLevel INTEGER,
          status TEXT,
          permissions TEXT,
          mfa_enabled INTEGER DEFAULT 1
        )
      `);

      // 2. Create Employees Table
      db.run(`
        CREATE TABLE IF NOT EXISTS employees (
          id TEXT PRIMARY KEY,
          employeeCode TEXT UNIQUE,
          name TEXT,
          email TEXT UNIQUE,
          role TEXT,
          department TEXT,
          designation TEXT,
          status TEXT,
          avatar TEXT,
          joinDate TEXT,
          performanceScore REAL,
          attendanceRate REAL
        )
      `);

      // 3. Create Attendance Table
      db.run(`
        CREATE TABLE IF NOT EXISTS attendance_records (
          id TEXT PRIMARY KEY,
          employeeId TEXT,
          employeeName TEXT,
          department TEXT,
          date TEXT,
          checkInTime TEXT,
          checkOutTime TEXT,
          breaks TEXT, -- JSON array of breaks
          shiftType TEXT,
          workMode TEXT,
          status TEXT,
          latitude REAL,
          longitude REAL,
          accuracy REAL,
          idempotencyKey TEXT UNIQUE
        )
      `);

      // 4. Create Corrections Table
      db.run(`
        CREATE TABLE IF NOT EXISTS corrections (
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

      // 5. Create Audit Logs Table
      db.run(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id TEXT PRIMARY KEY,
          timestamp TEXT,
          employeeId TEXT,
          action TEXT,
          details TEXT
        )
      `);

      // 5.5 Create MFA Challenges Table
      db.run(`
        CREATE TABLE IF NOT EXISTS mfa_challenges (
          email TEXT PRIMARY KEY,
          otp_hash TEXT,
          expires_at TEXT,
          attempts_count INTEGER,
          created_at TEXT,
          status TEXT
        )
      `);

      // 6. Create Shifts Table
      db.run(`
        CREATE TABLE IF NOT EXISTS shifts (
          id TEXT PRIMARY KEY,
          name TEXT,
          startTime TEXT, -- HH:MM
          endTime TEXT,
          gracePeriodMinutes INTEGER
        )
      `);

      // 7. Create Skills Table
      db.run(`
        CREATE TABLE IF NOT EXISTS skills (
          id TEXT PRIMARY KEY,
          employeeId TEXT,
          skillName TEXT,
          level INTEGER, -- 1 to 5
          isTopSkill INTEGER,
          isMissingSkill INTEGER
        )
      `);

      // 8. Create Performance Records Table
      db.run(`
        CREATE TABLE IF NOT EXISTS performance_records (
          id TEXT PRIMARY KEY,
          employeeId TEXT,
          quarter TEXT,
          kpiScore REAL,
          targetScore REAL
        )
      `);

      // Seed core users if empty
      db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
        if (err) return reject(err);
        if (row.count === 0) {
          const passHash = "$2a$10$T81n17/iPq6XhN.Wz96tqOuXvP9w7bC4T5uVbX2Rj7qD1yI/3K22.";
          const users = [
            {
              id: "usr-admin-01",
              name: "Sarah Connor",
              email: "admin@thestackly.com",
              password_hash: passHash,
              role: "ADMIN",
              department: "Executive",
              team: "System Architecture",
              location: "Global HQ",
              title: "System Administrator",
              clearanceLevel: 5,
              status: "ACTIVE",
              permissions: JSON.stringify(["USER_CREATE", "USER_UPDATE", "USER_DELETE", "USER_MANAGE", "ROLE_CREATE", "ROLE_UPDATE", "ROLE_DELETE", "ROLE_MANAGE", "PERMISSION_ASSIGN", "EMPLOYEE_VIEW_ALL", "EMPLOYEE_CREATE", "EMPLOYEE_UPDATE", "EMPLOYEE_DELETE", "REPORT_VIEW_ALL", "REPORT_EXPORT", "SYSTEM_SETTINGS_MANAGE", "SYSTEM_CONFIG", "AUDIT_LOG_VIEW", "VIEW_ALL_DATA"])
            },
            {
              id: "usr-hr-01",
              name: "Elena Rostova",
              email: "hr@thestackly.com",
              password_hash: passHash,
              role: "HR",
              department: "Human Resources",
              team: "People Operations",
              location: "New York",
              title: "VP of HR Operations",
              clearanceLevel: 4,
              status: "ACTIVE",
              permissions: JSON.stringify(["EMPLOYEE_VIEW", "EMPLOYEE_CREATE", "EMPLOYEE_UPDATE", "EMPLOYEE_PROFILE_MANAGE", "ATTENDANCE_VIEW_ALL", "ATTENDANCE_MANAGE", "LEAVE_APPROVE", "PERFORMANCE_MANAGE", "RECRUITMENT_MANAGE", "REPORT_GENERATE", "EMPLOYEE_MANAGE", "REPORT_VIEW"])
            },
            {
              id: "usr-mgr-01",
              name: "David Sterling",
              email: "manager@thestackly.com",
              password_hash: passHash,
              role: "MANAGER",
              department: "Engineering",
              team: "Frontend & Backend",
              location: "San Francisco",
              title: "Department Manager",
              clearanceLevel: 3,
              status: "ACTIVE",
              permissions: JSON.stringify(["TEAM_VIEW", "TEAM_ANALYTICS_VIEW", "EMPLOYEE_VIEW_TEAM", "ATTENDANCE_VIEW_TEAM", "LEAVE_APPROVE", "PERFORMANCE_REVIEW", "TASK_ASSIGN", "REPORT_VIEW_TEAM"])
            },
            {
              id: "usr-lead-01",
              name: "Marcus Vance",
              email: "lead@thestackly.com",
              password_hash: passHash,
              role: "TEAM_LEAD",
              department: "Engineering",
              team: "Frontend Team",
              location: "San Francisco",
              title: "Team Lead (TL)",
              clearanceLevel: 2,
              status: "ACTIVE",
              permissions: JSON.stringify(["TEAM_MEMBER_VIEW", "TEAM_VIEW", "TASK_ASSIGN", "TASK_TRACK", "ATTENDANCE_VIEW_TEAM", "PRODUCTIVITY_VIEW", "FEEDBACK_CREATE", "PERFORMANCE_FEEDBACK"])
            },
            {
              id: "usr-emp-01",
              name: "Alex Mercer",
              email: "employee@thestackly.com",
              password_hash: passHash,
              role: "EMPLOYEE",
              department: "Engineering",
              team: "Frontend Team",
              location: "San Francisco",
              title: "Full Stack Developer",
              clearanceLevel: 1,
              status: "ACTIVE",
              permissions: JSON.stringify(["PROFILE_VIEW", "PROFILE_UPDATE", "ATTENDANCE_VIEW_SELF", "LEAVE_REQUEST", "PERFORMANCE_VIEW_SELF", "GOAL_UPDATE", "DOCUMENT_UPLOAD"])
            }
          ];

          const stmt = db.prepare("INSERT OR IGNORE INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)");
          users.forEach(u => {
            stmt.run(u.id, u.name, u.email, u.password_hash, u.role, u.department, u.team, u.location, u.title, u.clearanceLevel, u.status, u.permissions);
          });
          stmt.finalize();
        }
      });

      // Seed shifts if empty
      db.get("SELECT COUNT(*) as count FROM shifts", (err, row) => {
        if (err) return reject(err);
        if (row.count === 0) {
          const stmt = db.prepare("INSERT OR IGNORE INTO shifts VALUES (?, ?, ?, ?, ?)");
          stmt.run("shift-regular", "Regular", "09:00", "18:00", 15);
          stmt.run("shift-flexible", "Flexible", "00:00", "23:59", 0);
          stmt.run("shift-overnight", "Overnight", "21:00", "06:00", 15);
          stmt.finalize();
        }
      });

      // Seed employees if empty
      db.get("SELECT COUNT(*) as count FROM employees", (err, row) => {
        if (err) return reject(err);
        if (row.count === 0) {
          const stmt = db.prepare("INSERT OR IGNORE INTO employees VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
          const depts = ['Engineering', 'Product Management', 'Sales & Marketing', 'Human Resources', 'Customer Success', 'Finance & Operations'];
          const designatives = ['Senior Software Engineer', 'Staff Systems Architect', 'Principal DevOps Lead', 'HR Operations Manager', 'Financial Analyst', 'Customer Success Director'];
          const roles = ['EMPLOYEE', 'TEAM_LEAD', 'MANAGER', 'HR', 'ADMIN'];
          const statuses = ['PRESENT', 'REMOTE', 'ON_LEAVE', 'OFFLINE'];
          
          for (let i = 1; i <= 200; i++) {
            const id = `emp-${i}`;
            const code = `STK-${10000 + i}`;
            const name = `Employee ${i}`;
            const email = `employee${i}@thestackly.com`;
            const role = roles[i % roles.length];
            const dept = depts[i % depts.length];
            const desig = designatives[i % designatives.length];
            const status = statuses[i % statuses.length];
            const avatar = `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150`;
            const joinDate = '2023-01-15';
            const performanceScore = 80 + (i % 20);
            const attendanceRate = 90 + (i % 10);
            
            stmt.run(id, code, name, email, role, dept, desig, status, avatar, joinDate, performanceScore, attendanceRate);
          }
          stmt.finalize();
          console.log("Employees table seeded.");
        }
        resolve(true);
      });
    });
  });
};

export const logAudit = (userId, action, details) => {
  const id = Math.random().toString(36).substr(2, 9);
  const timestamp = new Date().toISOString();
  db.run("INSERT INTO audit_logs VALUES (?, ?, ?, ?, ?)", [id, timestamp, userId, action, details], (err) => {
    if (err) console.error("Failed to write audit log:", err);
  });
};

export default db;
