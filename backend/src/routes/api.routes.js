import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import * as attendanceController from '../controllers/attendance.controller.js';
import * as analyticsController from '../controllers/analytics.controller.js';
import { authenticateToken, authorizeRoles, enforceScope } from '../middleware/auth.js';
import db from '../config/db.js';

const router = express.Router();

// Auth Routes
router.post('/auth/login', authController.login);
router.post('/auth/mfa-verify', authController.verifyMfa);

// Employees Directory (enforces scope filter internally or via middleware)
router.get('/employees', authenticateToken, enforceScope, (req, res) => {
  const { role, department } = req.user;
  if (role === 'ADMIN' || role === 'HR') {
    db.all("SELECT * FROM employees", [], (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.json({ success: true, data: rows });
    });
  } else {
    db.all("SELECT * FROM employees WHERE department = ?", [department], (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.json({ success: true, data: rows });
    });
  }
});

// Attendance Punch & Session Routes
router.post('/attendance/check-in', authenticateToken, enforceScope, attendanceController.checkIn);
router.post('/attendance/break', authenticateToken, enforceScope, attendanceController.takeBreak);
router.post('/attendance/resume', authenticateToken, enforceScope, attendanceController.resumeWork);
router.post('/attendance/check-out', authenticateToken, enforceScope, attendanceController.checkOut);
router.get('/attendance/records', authenticateToken, enforceScope, attendanceController.getRecords);

// Corrections Requests
router.post('/attendance/corrections', authenticateToken, enforceScope, attendanceController.submitCorrection);
router.get('/attendance/corrections', authenticateToken, enforceScope, attendanceController.getCorrections);
router.put('/attendance/corrections/:id', authenticateToken, attendanceController.reviewCorrection);

// Analytics
router.get('/analytics', authenticateToken, analyticsController.getAnalytics);

// User Management (Admin Only)
router.get('/users', authenticateToken, authorizeRoles(['ADMIN']), (req, res) => {
  db.all("SELECT id, name, email, role, department, team, location, title, clearanceLevel, status, permissions FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    return res.json({ success: true, data: rows.map(r => ({ ...r, permissions: JSON.parse(r.permissions || '[]') })) });
  });
});

router.put('/users/:userId/role', authenticateToken, authorizeRoles(['ADMIN']), (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  db.run("UPDATE users SET role = ? WHERE id = ?", [role, userId], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    db.get("SELECT id, name, email, role, department, team, location, title, clearanceLevel, status, permissions FROM users WHERE id = ?", [userId], (err2, user) => {
      if (err2 || !user) return res.status(404).json({ success: false, message: 'Updated user not found' });
      return res.json({ success: true, data: { ...user, permissions: JSON.parse(user.permissions || '[]') } });
    });
  });
});

router.delete('/users/:userId', authenticateToken, authorizeRoles(['ADMIN']), (req, res) => {
  const { userId } = req.params;
  db.run("DELETE FROM users WHERE id = ?", [userId], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    return res.json({ success: true });
  });
});

export default router;
