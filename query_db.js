import { createConnection } from './backend/src/database/connection.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database', 'wfa.db');
console.log(`Connecting to: ${dbPath}`);
const db = createConnection(dbPath);

db.serialize(() => {
  // 1. Integrity check
  db.get('PRAGMA integrity_check', (err, row) => {
    console.log('Integrity Check:', err ? err : row);
  });

  // 2. FK check
  db.all('PRAGMA foreign_key_check', (err, rows) => {
    console.log('Foreign Key Check Violations:', err ? err : rows);
  });

  // 3. Employee count
  db.get('SELECT COUNT(*) AS count FROM employees', (err, row) => {
    console.log('Total Employees in employees table:', row ? row.count : err);
  });

  // 4. Employee counts by location
  db.all('SELECT location, COUNT(*) AS count FROM employees GROUP BY location', (err, rows) => {
    console.log('Employee counts by location in employees table:');
    if (err) console.error(err);
    else console.log(rows);
  });

  // 5. Total users count
  db.get('SELECT COUNT(*) AS count FROM users', (err, row) => {
    console.log('Total Users in users table:', row ? row.count : err);
  });

  // 6. Users by role
  db.all('SELECT role, COUNT(*) AS count FROM users GROUP BY role', (err, rows) => {
    console.log('Users by role:');
    if (err) console.error(err);
    else console.log(rows);
  });

  // 7. Duplicate employeeCodes
  db.all('SELECT employeeCode, COUNT(*) AS count FROM employees GROUP BY employeeCode HAVING count > 1', (err, rows) => {
    console.log('Duplicate employeeCodes:', err ? err : rows);
  });

  // 8. Duplicate emails
  db.all('SELECT email, COUNT(*) AS count FROM employees GROUP BY email HAVING count > 1', (err, rows) => {
    console.log('Duplicate employee emails:', err ? err : rows);
  });
});

db.close();
