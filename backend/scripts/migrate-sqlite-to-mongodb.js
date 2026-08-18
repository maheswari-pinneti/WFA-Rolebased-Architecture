import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

import { connectMongoDB } from '../src/config/mongodb.js';
import { User } from '../src/models/User.js';
import { Employee } from '../src/models/Employee.js';
import { Attendance, Correction } from '../src/models/Attendance.js';
import { LeaveRequest, Notification, Organization, Department, Team, Shift, Skill, PerformanceRecord, Task } from '../src/models/Department.js';
import { AuditLog } from '../src/models/AuditLog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../database/wfa.db');

const runMigration = async () => {
  if (!fs.existsSync(dbPath)) {
    console.error(`SQLite database not found at: ${dbPath}. Aborting migration.`);
    process.exit(1);
  }

  console.log(`Reading SQLite database: ${dbPath}`);
  const sqliteDb = new sqlite3.Database(dbPath);

  // Connect to Mongo
  await connectMongoDB();

  const fetchAll = (sql, params = []) => new Promise((resolve, reject) => {
    sqliteDb.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });

  const summary = {
    organizations: 0,
    departments: 0,
    teams: 0,
    shifts: 0,
    users: 0,
    employees: 0,
    skills: 0,
    performanceRecords: 0,
    tasks: 0,
    attendanceRecords: 0,
    corrections: 0,
    leaveRequests: 0,
    notifications: 0,
    auditLogs: 0,
    failed: 0,
    duplicates: 0
  };

  try {
    console.log("Migrating organizations...");
    const orgs = await fetchAll("SELECT * FROM organizations");
    for (const org of orgs) {
      await Organization.updateOne({ id: org.id }, org, { upsert: true });
      summary.organizations++;
    }

    console.log("Migrating departments...");
    const depts = await fetchAll("SELECT * FROM departments");
    for (const dept of depts) {
      await Department.updateOne({ id: dept.id }, dept, { upsert: true });
      summary.departments++;
    }

    console.log("Migrating teams...");
    const teams = await fetchAll("SELECT * FROM teams");
    for (const team of teams) {
      await Team.updateOne({ id: team.id }, team, { upsert: true });
      summary.teams++;
    }

    console.log("Migrating shifts...");
    const shifts = await fetchAll("SELECT * FROM shifts");
    for (const shift of shifts) {
      await Shift.updateOne({ id: shift.id }, shift, { upsert: true });
      summary.shifts++;
    }

    console.log("Migrating users...");
    const users = await fetchAll("SELECT * FROM users");
    for (const user of users) {
      let perms = [];
      if (user.permissions) {
        try {
          perms = JSON.parse(user.permissions);
        } catch {
          perms = String(user.permissions).split(',').map(p => p.trim());
        }
      }
      
      let passwordHash = user.password_hash;
      if (passwordHash && !passwordHash.startsWith('$2a$') && !passwordHash.startsWith('$2b$')) {
        console.log(`Hashing plaintext password for user: ${user.email}`);
        passwordHash = await bcrypt.hash(passwordHash, 10);
      }

      const userData = {
        ...user,
        permissions: perms,
        password_hash: passwordHash
      };

      await User.updateOne({ id: user.id }, userData, { upsert: true });
      summary.users++;
    }

    console.log("Migrating employees...");
    const employees = await fetchAll("SELECT * FROM employees");
    for (const emp of employees) {
      await Employee.updateOne({ id: emp.id }, emp, { upsert: true });
      summary.employees++;
    }

    console.log("Migrating skills...");
    const skills = await fetchAll("SELECT * FROM skills");
    for (const skill of skills) {
      await Skill.updateOne({ id: skill.id }, skill, { upsert: true });
      summary.skills++;
    }

    console.log("Migrating performance records...");
    const perfs = await fetchAll("SELECT * FROM performance_records");
    for (const perf of perfs) {
      await PerformanceRecord.updateOne({ id: perf.id }, perf, { upsert: true });
      summary.performanceRecords++;
    }

    console.log("Migrating tasks...");
    const tasks = await fetchAll("SELECT * FROM tasks");
    for (const task of tasks) {
      await Task.updateOne({ id: task.id }, task, { upsert: true });
      summary.tasks++;
    }

    console.log("Migrating attendance records...");
    const attendance = await fetchAll("SELECT * FROM attendance_records");
    for (const record of attendance) {
      let parsedBreaks = [];
      if (record.breaks) {
        try {
          parsedBreaks = JSON.parse(record.breaks);
        } catch {
          parsedBreaks = [];
        }
      }
      const recordData = {
        ...record,
        breaks: parsedBreaks
      };
      await Attendance.updateOne({ id: record.id }, recordData, { upsert: true });
      summary.attendanceRecords++;
    }

    console.log("Migrating corrections...");
    const corrections = await fetchAll("SELECT * FROM corrections");
    for (const correction of corrections) {
      await Correction.updateOne({ id: correction.id }, correction, { upsert: true });
      summary.corrections++;
    }

    console.log("Migrating leave requests...");
    const leaves = await fetchAll("SELECT * FROM leave_requests");
    for (const leave of leaves) {
      await LeaveRequest.updateOne({ id: leave.id }, leave, { upsert: true });
      summary.leaveRequests++;
    }

    console.log("Migrating notifications...");
    const notes = await fetchAll("SELECT * FROM notifications");
    for (const note of notes) {
      await Notification.updateOne({ id: note.id }, note, { upsert: true });
      summary.notifications++;
    }

    console.log("Migrating audit logs...");
    const logs = await fetchAll("SELECT * FROM audit_logs");
    for (const log of logs) {
      await AuditLog.updateOne({ id: log.id }, log, { upsert: true });
      summary.auditLogs++;
    }

    console.log("\nDATABASE MIGRATION COMPLETED SUCCESSFULLY!");
    console.log("------------------------------------------");
    console.log(`Organizations migrated: ${summary.organizations}`);
    console.log(`Departments migrated:   ${summary.departments}`);
    console.log(`Teams migrated:         ${summary.teams}`);
    console.log(`Shifts migrated:        ${summary.shifts}`);
    console.log(`Users migrated:         ${summary.users}`);
    console.log(`Employees migrated:     ${summary.employees}`);
    console.log(`Skills migrated:        ${summary.skills}`);
    console.log(`Performance migrated:   ${summary.performanceRecords}`);
    console.log(`Tasks migrated:         ${summary.tasks}`);
    console.log(`Attendance migrated:    ${summary.attendanceRecords}`);
    console.log(`Corrections migrated:   ${summary.corrections}`);
    console.log(`Leave requests:         ${summary.leaveRequests}`);
    console.log(`Notifications:          ${summary.notifications}`);
    console.log(`Audit logs migrated:    ${summary.auditLogs}`);
    console.log(`Failed records:         ${summary.failed}`);
    console.log(`Duplicate records:      ${summary.duplicates}`);

  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    sqliteDb.close();
    await mongoose.disconnect();
    console.log("Connections closed.");
  }
};

runMigration();
