import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbDir = path.resolve(__dirname, '../../../database');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbName = process.env.DB_NAME || 'wfa.db';
const dbPath = path.join(dbDir, dbName);
const db = new sqlite3.Database(dbPath);

// Enable foreign keys, WAL mode, and busy timeout for transaction safety
db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON;");
  db.run("PRAGMA journal_mode = WAL;");
  db.run("PRAGMA busy_timeout = 10000;");
});

const executeWithRetry = async (fn, retries = 5, initialDelay = 50) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      const isLockError = err.code === 'SQLITE_BUSY' || err.code === 'SQLITE_LOCKED' || (err.message && (err.message.includes('busy') || err.message.includes('locked')));
      if (isLockError && i < retries - 1) {
        const backoffDelay = initialDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        continue;
      }
      throw err;
    }
  }
};

export const run = (sql, params = []) => {
  return executeWithRetry(() => new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) reject(err);
      else resolve(this);
    });
  }));
};

export const get = (sql, params = []) => {
  return executeWithRetry(() => new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  }));
};

export const all = (sql, params = []) => {
  return executeWithRetry(() => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  }));
};

export const prepareAndRun = (sql, rows) => {
  return executeWithRetry(() => new Promise((resolve, reject) => {
    const statement = db.prepare(sql, (prepareError) => {
      if (prepareError) {
        reject(prepareError);
        return;
      }
      try {
        rows.forEach((row) => statement.run(row));
        statement.finalize((finalizeError) => (finalizeError ? reject(finalizeError) : resolve()));
      } catch (err) {
        reject(err);
      }
    });
  }));
};

// Close helper
export const closeDb = () => {
  return new Promise((resolve) => {
    db.close((err) => {
      if (err) {
        if (err.message !== 'SQLITE_ERR_MISUSE' && !err.message.includes('closed')) {
          console.error('Error closing database on exit:', err.message);
        }
      }
      resolve();
    });
  });
};

process.on('exit', () => {
  db.close(() => {});
});

export { db };
export default db;
