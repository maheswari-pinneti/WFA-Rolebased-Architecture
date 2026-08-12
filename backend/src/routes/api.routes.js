import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import * as attendanceController from '../controllers/attendance.controller.js';
import * as analyticsController from '../controllers/analytics.controller.js';
import * as workforceController from '../controllers/workforce.controller.js';
import * as employeeController from '../controllers/employee.controller.js';
import * as organizationController from '../controllers/organization.controller.js';
import * as auditController from '../controllers/audit.controller.js';
import { authenticateToken, authorizeRoles, authorizePermissions, enforceScope } from '../middleware/auth.js';
import db from '../config/db.js';

const router = express.Router();

// Auth Routes
router.post('/auth/login', authController.login);
router.post('/auth/mfa-verify', authController.verifyMfa);
router.post('/auth/logout', authenticateToken, authController.logout);
router.get('/auth/me', authenticateToken, authController.getMe);
router.post('/auth/refresh', authenticateToken, authController.refresh);


// Employees Directory (enforces scope filter internally or via middleware)
router.get('/employees', authenticateToken, enforceScope, (req, res) => {
  const { role, id, department, team, organizationId = 'org-stackly' } = req.user;
  if (role === 'ADMIN' || role === 'HR') {
    db.all("SELECT * FROM employees WHERE organizationId = ? ORDER BY name", [organizationId], (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.json({ success: true, data: rows });
    });
  } else if (role === 'EMPLOYEE') {
    db.all("SELECT * FROM employees WHERE organizationId = ? AND id = ?", [organizationId, id], (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.json({ success: true, data: rows });
    });
  } else if (role === 'TEAM_LEAD') {
    db.all("SELECT * FROM employees WHERE organizationId = ? AND department = ? AND team = ? ORDER BY name", [organizationId, department, team], (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.json({ success: true, data: rows });
    });
  } else {
    db.all("SELECT * FROM employees WHERE organizationId = ? AND department = ? ORDER BY name", [organizationId, department], (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.json({ success: true, data: rows });
    });
  }
});

router.put('/employees/:id/status', authenticateToken, enforceScope, authorizePermissions(['EMPLOYEE_UPDATE', 'EMPLOYEE_MANAGE']), (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['ACTIVE', 'PRESENT', 'REMOTE', 'ON_LEAVE', 'OFFLINE'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid employee status.' });
  }
  db.run('UPDATE employees SET status = ? WHERE id = ? AND organizationId = ?', [status, id, req.user.organizationId || 'org-stackly'], function onUpdate(err) {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!this.changes) return res.status(404).json({ success: false, message: 'Employee not found.' });
    db.get('SELECT * FROM employees WHERE id = ? AND organizationId = ?', [id, req.user.organizationId || 'org-stackly'], (getErr, employee) => {
      if (getErr) return res.status(500).json({ success: false, message: getErr.message });
      return res.json({ success: true, data: employee });
    });
  });
});

// Employee CRUD Route mappings
router.get('/employees/:id', authenticateToken, enforceScope, employeeController.getEmployeeById);
router.post('/employees', authenticateToken, enforceScope, authorizePermissions(['EMPLOYEE_CREATE', 'EMPLOYEE_MANAGE']), employeeController.createEmployee);
router.put('/employees/:id', authenticateToken, enforceScope, authorizePermissions(['EMPLOYEE_UPDATE', 'EMPLOYEE_MANAGE']), employeeController.updateEmployee);
router.delete('/employees/:id', authenticateToken, enforceScope, authorizePermissions(['EMPLOYEE_DELETE', 'EMPLOYEE_MANAGE']), employeeController.deleteEmployee);

// Team CRUD Route mappings
router.get('/teams', authenticateToken, employeeController.getTeams);
router.get('/teams/:id/members', authenticateToken, enforceScope, employeeController.getTeamMembers);

// Org, Dept & RBAC Route mappings
router.get('/departments', authenticateToken, organizationController.getDepartments);
router.get('/organizations', authenticateToken, organizationController.getOrganizations);
router.get('/roles', authenticateToken, organizationController.getRoles);
router.get('/permissions', authenticateToken, organizationController.getPermissions);

// Attendance Punch & Session Routes
router.get('/attendance/today', authenticateToken, attendanceController.getTodayAttendance);
router.post('/attendance/check-in', authenticateToken, enforceScope, attendanceController.checkIn);
router.post('/attendance/break', authenticateToken, enforceScope, attendanceController.takeBreak);
router.post('/attendance/resume', authenticateToken, enforceScope, attendanceController.resumeWork);
router.post('/attendance/check-out', authenticateToken, enforceScope, attendanceController.checkOut);
router.get('/attendance/records', authenticateToken, enforceScope, attendanceController.getRecords);
router.get('/attendance/shifts', authenticateToken, attendanceController.getShifts);
router.get('/attendance/audit-logs', authenticateToken, attendanceController.getAuditLogs);


// Persisted leave and task workflows, scoped by organization/department/team/employee.
router.get('/leave-requests', authenticateToken, enforceScope, workforceController.getLeaveRequests);
router.post('/leave-requests', authenticateToken, enforceScope, workforceController.createLeaveRequest);
router.put('/leave-requests/:id', authenticateToken, authorizeRoles(['ADMIN', 'HR', 'MANAGER', 'TEAM_LEAD']), workforceController.reviewLeaveRequest);
router.get('/tasks', authenticateToken, enforceScope, workforceController.getTasks);
router.put('/tasks/:id', authenticateToken, workforceController.updateTask);

// Corrections Requests
router.post('/attendance/corrections', authenticateToken, enforceScope, attendanceController.submitCorrection);
router.get('/attendance/corrections', authenticateToken, enforceScope, attendanceController.getCorrections);
router.put('/attendance/corrections/:id', authenticateToken, authorizeRoles(['ADMIN', 'HR', 'MANAGER', 'TEAM_LEAD']), attendanceController.reviewCorrection);

// Analytics
router.get('/analytics', authenticateToken, enforceScope, analyticsController.getAnalytics);
router.get('/dashboard/metrics', authenticateToken, enforceScope, analyticsController.getAnalytics);

// Dashboard specific endpoints
router.get('/dashboard/summary', authenticateToken, enforceScope, analyticsController.getDashboardSummary);
router.get('/dashboard/workforce', authenticateToken, enforceScope, analyticsController.getWorkforceDistribution);
router.get('/dashboard/headcount', authenticateToken, enforceScope, analyticsController.getHeadcountAnalytics);
router.get('/dashboard/risk', authenticateToken, enforceScope, analyticsController.getRiskAnalytics);

// Analytics trends
router.get('/analytics/employee-growth', authenticateToken, enforceScope, analyticsController.getEmployeeGrowth);
router.get('/analytics/attendance-trend', authenticateToken, enforceScope, analyticsController.getAttendanceTrend);
router.get('/analytics/performance', authenticateToken, enforceScope, analyticsController.getPerformanceAnalytics);

// Audit Logs
router.get('/audit/logs', authenticateToken, authorizeRoles(['ADMIN', 'HR']), auditController.getAuditLogs);
router.get('/audit/logs/:id', authenticateToken, authorizeRoles(['ADMIN', 'HR']), auditController.getAuditLogDetail);

// User Management (Admin Only)

router.get('/users', authenticateToken, authorizeRoles(['ADMIN']), (req, res) => {
  db.all("SELECT id, name, email, role, department, team, location, title, clearanceLevel, status, permissions FROM users WHERE organizationId = ?", [req.user.organizationId || 'org-stackly'], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    return res.json({ success: true, data: rows.map(r => ({ ...r, permissions: JSON.parse(r.permissions || '[]') })) });
  });
});

router.put('/users/:userId/role', authenticateToken, authorizeRoles(['ADMIN']), (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  if (!['ADMIN', 'HR', 'MANAGER', 'TEAM_LEAD', 'EMPLOYEE'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role.' });
  }
  db.run("UPDATE users SET role = ? WHERE id = ? AND organizationId = ?", [role, userId, req.user.organizationId || 'org-stackly'], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    db.get("SELECT id, name, email, role, department, team, location, title, clearanceLevel, status, permissions FROM users WHERE id = ? AND organizationId = ?", [userId, req.user.organizationId || 'org-stackly'], (err2, user) => {
      if (err2 || !user) return res.status(404).json({ success: false, message: 'Updated user not found' });
      return res.json({ success: true, data: { ...user, permissions: JSON.parse(user.permissions || '[]') } });
    });
  });
});

router.delete('/users/:userId', authenticateToken, authorizeRoles(['ADMIN']), (req, res) => {
  const { userId } = req.params;
  db.run("DELETE FROM users WHERE id = ? AND organizationId = ?", [userId, req.user.organizationId || 'org-stackly'], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    return res.json({ success: true });
  });
});

export default router;
