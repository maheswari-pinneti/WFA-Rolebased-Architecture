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

const configureConnection = (conn) => {
  conn.serialize(() => {
    conn.run("PRAGMA foreign_keys = ON;");
    conn.run("PRAGMA journal_mode = WAL;");
    conn.run("PRAGMA busy_timeout = 10000;");
    conn.get("PRAGMA foreign_keys;", (err, row) => {
      if (err) {
        console.error("[DB] Failed to verify PRAGMA foreign_keys:", err.message);
        throw err;
      }
      const val = row ? (row.foreign_keys !== undefined ? row.foreign_keys : Object.values(row)[0]) : null;
      if (Number(val) !== 1) {
        const errorMsg = "SQLite foreign_keys pragma is not enabled for this connection";
        console.error("[DB]", errorMsg);
        throw new Error(errorMsg);
      }
      console.log("[DB] SQLite connection established");
      console.log("[DB] PRAGMA foreign_keys = 1");
      console.log("[DB] Foreign key enforcement: ENABLED");
    });
  });

  const originalRun = conn.run.bind(conn);
  const originalGet = conn.get.bind(conn);
  const originalAll = conn.all.bind(conn);

  conn.run = function (sql, ...args) {
    let callback = typeof args[args.length - 1] === 'function' ? args.pop() : null;
    let params = args;
    if (args.length === 1 && (Array.isArray(args[0]) || typeof args[0] === 'object' || args[0] === null || args[0] === undefined)) {
      params = args[0];
    }
    const attempt = (retryCount = 0) => {
      originalRun(sql, params, function (err, ...res) {
        if (err) {
          const isLockError = err.code === 'SQLITE_BUSY' || err.code === 'SQLITE_LOCKED' || (err.message && (err.message.includes('busy') || err.message.includes('locked')));
          if (isLockError && retryCount < 5) {
            const delay = 50 * Math.pow(2, retryCount);
            setTimeout(() => attempt(retryCount + 1), delay);
            return;
          }
          if (callback) callback.call(this, err, ...res);
          return;
        }
        if (callback) callback.call(this, null, ...res);
      });
    };
    attempt();
  };

  conn.get = function (sql, ...args) {
    let callback = typeof args[args.length - 1] === 'function' ? args.pop() : null;
    let params = args;
    if (args.length === 1 && (Array.isArray(args[0]) || typeof args[0] === 'object' || args[0] === null || args[0] === undefined)) {
      params = args[0];
    }
    const attempt = (retryCount = 0) => {
      originalGet(sql, params, function (err, ...res) {
        if (err) {
          const isLockError = err.code === 'SQLITE_BUSY' || err.code === 'SQLITE_LOCKED' || (err.message && (err.message.includes('busy') || err.message.includes('locked')));
          if (isLockError && retryCount < 5) {
            const delay = 50 * Math.pow(2, retryCount);
            setTimeout(() => attempt(retryCount + 1), delay);
            return;
          }
          if (callback) callback.call(this, err, ...res);
          return;
        }
        if (callback) callback.call(this, null, ...res);
      });
    };
    attempt();
  };

  conn.all = function (sql, ...args) {
    let callback = typeof args[args.length - 1] === 'function' ? args.pop() : null;
    let params = args;
    if (args.length === 1 && (Array.isArray(args[0]) || typeof args[0] === 'object' || args[0] === null || args[0] === undefined)) {
      params = args[0];
    }
    const attempt = (retryCount = 0) => {
      originalAll(sql, params, function (err, ...res) {
        if (err) {
          const isLockError = err.code === 'SQLITE_BUSY' || err.code === 'SQLITE_LOCKED' || (err.message && (err.message.includes('busy') || err.message.includes('locked')));
          if (isLockError && retryCount < 5) {
            const delay = 50 * Math.pow(2, retryCount);
            setTimeout(() => attempt(retryCount + 1), delay);
            return;
          }
          if (callback) callback.call(this, err, ...res);
          return;
        }
        if (callback) callback.call(this, null, ...res);
      });
    };
    attempt();
  };

  return conn;
};

import 'dotenv/config';

export const createConnection = (customDbPath) => {
  const conn = new sqlite3.Database(customDbPath);
  return configureConnection(conn);
};

const resolveDbPath = () => {
  if (process.env.DATABASE_PATH) {
    return path.resolve(process.cwd(), process.env.DATABASE_PATH);
  }
  const dbName = process.env.DB_NAME || 'wfa.db';
  return path.join(dbDir, dbName);
};

const dbPath = resolveDbPath();
console.log("\nSQLite database:");
console.log(dbPath + "\n");

const db = createConnection(dbPath);


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
