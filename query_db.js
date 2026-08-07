import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database', 'wfa.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log('--- USERS TABLE ---');
  db.all('SELECT id, name, email, role, department FROM users', (err, rows) => {
    if (err) console.error(err);
    else console.log(rows);
  });

  console.log('\n--- ATTENDANCE RECORDS TABLE ---');
  db.all('SELECT id, employeeId, employeeName, status, checkInTime, checkOutTime FROM attendance_records', (err, rows) => {
    if (err) console.error(err);
    else console.log(rows);
  });
});

db.close();
