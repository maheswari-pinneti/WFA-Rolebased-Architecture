import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { run, get } from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, '../../../database/migrations');

export const migrate = async () => {
  // Create schema_migrations table
  await run(`CREATE TABLE IF NOT EXISTS schema_migrations (
    version TEXT PRIMARY KEY,
    migrated_at TEXT NOT NULL
  )`);

  if (!fs.existsSync(migrationsDir)) {
    console.warn("Migrations directory does not exist:", migrationsDir);
    return;
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const version = file.split('_')[0];
    const alreadyMigrated = await get('SELECT 1 FROM schema_migrations WHERE version = ?', [version]);
    
    if (!alreadyMigrated) {
      console.log(`Running migration: ${file}`);
      await run('BEGIN TRANSACTION');
      try {
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        const statements = sql.split(';').map(s => s.trim()).filter(Boolean);
        for (const statement of statements) {
          await run(statement);
        }
        await run('INSERT INTO schema_migrations (version, migrated_at) VALUES (?, ?)', [version, new Date().toISOString()]);
        await run('COMMIT');
      } catch (err) {
        await run('ROLLBACK');
        console.error(`Migration failed for ${file}:`, err);
        throw err;
      }
    }
  }

  // Create database indexes on high-traffic fields
  const extraIndexes = [
    "CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);",
    "CREATE INDEX IF NOT EXISTS idx_employees_emp_id ON employees(employeeCode);",
    "CREATE INDEX IF NOT EXISTS idx_attendance_employee ON attendance_records(employeeId);",
    "CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date);",
    "CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);",
    "CREATE INDEX IF NOT EXISTS idx_attendance_employee_date ON attendance_records(employeeId, date);"
  ];

  for (const indexSql of extraIndexes) {
    try {
      await run(indexSql);
    } catch (indexErr) {
      console.error(`Failed to create index: ${indexSql}`, indexErr);
    }
  }

  return true;
};
