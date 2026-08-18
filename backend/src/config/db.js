import { db, run, get, all, prepareAndRun } from '../database/connection.js';
import { migrate } from '../database/migrate.js';
import { seed } from '../database/seed.js';

const ORGANIZATION_ID = 'org-stackly';

let initPromise;
export const initDb = () => {
  if (!initPromise) {
    initPromise = (async () => {
      try {
        // Run database migrations
        await migrate();
        // Deterministically seed non-destructively
        await seed();
        return true;
      } catch (err) {
        console.error("Database initialization failed:", err);
        throw err;
      }
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
