import db from '../config/db.js';

export const EmployeeModel = {
  findAll: (orgId) => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM employees WHERE organizationId = ? ORDER BY name', [orgId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
  findById: (id, orgId) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM employees WHERE id = ? AND organizationId = ?', [id, orgId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  updateStatus: (id, status, orgId) => {
    return new Promise((resolve, reject) => {
      db.run('UPDATE employees SET status = ? WHERE id = ? AND organizationId = ?', [status, id, orgId], (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }
};
