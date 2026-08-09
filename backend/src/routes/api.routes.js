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
// Employees Directory CRUD Operations
router.get('/employees', authenticateToken, enforceScope, (req, res) => {
  const { role, department } = req.user;
  if (role === 'ADMIN' || role === 'HR' || role === 'HR_MANAGER') {
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

router.get('/employees/:id', authenticateToken, enforceScope, (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM employees WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Employee not found' });
    return res.json({ success: true, data: row });
  });
});

router.post('/employees', authenticateToken, authorizeRoles(['ADMIN', 'HR', 'HR_MANAGER']), (req, res) => {
  const { id, employeeCode, name, email, role, department, designation, status, avatar, joinDate, performanceScore, attendanceRate } = req.body;
  db.run(
    "INSERT INTO employees VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [id, employeeCode, name, email, role, department, designation, status, avatar, joinDate, performanceScore, attendanceRate],
    (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.status(211).json({ success: true, data: req.body });
    }
  );
});

router.put('/employees/:id', authenticateToken, authorizeRoles(['ADMIN', 'HR', 'HR_MANAGER']), (req, res) => {
  const { id } = req.params;
  const { name, role, department, designation, status } = req.body;
  db.run(
    "UPDATE employees SET name = ?, role = ?, department = ?, designation = ?, status = ? WHERE id = ?",
    [name, role, department, designation, status, id],
    (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.json({ success: true });
    }
  );
});

router.delete('/employees/:id', authenticateToken, authorizeRoles(['ADMIN', 'HR', 'HR_MANAGER']), (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM employees WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    return res.json({ success: true });
  });
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

// Audit Logs (Admin/HR Only)
router.get('/audit-logs', authenticateToken, authorizeRoles(['ADMIN', 'HR', 'HR_MANAGER']), (req, res) => {
  db.all("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 500", [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    return res.json({ success: true, data: rows });
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
