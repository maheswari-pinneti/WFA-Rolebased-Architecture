import db from '../config/db.js';

export const UserModel = {
  findById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  updateRole: (id, role) => {
    return new Promise((resolve, reject) => {
      db.run('UPDATE users SET role = ? WHERE id = ?', [role, id], (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }
};
