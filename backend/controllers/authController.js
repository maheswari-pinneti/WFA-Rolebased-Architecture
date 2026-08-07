import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

const JWT_SECRET = 'wfa_secret_key_123';

export const login = (req, res) => {
  const { email } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, department: user.department },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          team: user.team,
          location: user.location,
          title: user.title,
          status: user.status,
          permissions: JSON.parse(user.permissions)
        }
      }
    });
  });
};

export const signup = (req, res) => {
  const { name, email, role, department, team, title } = req.body;
  const id = 'usr-' + Math.random().toString(36).substr(2, 9);
  const permissions = JSON.stringify(["PROFILE_VIEW", "PROFILE_UPDATE", "ATTENDANCE_VIEW_SELF"]);

  db.run(`
    INSERT INTO users (id, name, email, password_hash, role, department, team, location, title, status, permissions)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [id, name, email, '', role || 'EMPLOYEE', department || 'Engineering', team || 'Frontend Team', 'San Francisco', title || 'Developer', 'ACTIVE', permissions], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: 'User signed up successfully' });
  });
};
