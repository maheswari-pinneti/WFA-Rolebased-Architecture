import jwt from 'jsonwebtoken';
import db from '../database/connection.js';
const ORGANIZATION_ID = 'org-stackly';


import { env } from '../config/env.js';

const JWT_SECRET = env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized access token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    req.user = { ...user, organizationId: user.organizationId || ORGANIZATION_ID };
    next();
  });
};

export const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access Denied: Insufficient Permissions' });
    }
    next();
  };
};

export const authorizePermissions = (allowedPermissions) => {
  return (req, res, next) => {
    const permissions = Array.isArray(req.user?.permissions) ? req.user.permissions : [];
    if (req.user?.role === 'ADMIN' || allowedPermissions.some((permission) => permissions.includes(permission))) {
      return next();
    }
    return res.status(403).json({ success: false, message: 'Access Denied: Required permission is missing.' });
  };
};

// Check if request complies with organization, department, and employee scopes
export const enforceScope = (req, res, next) => {
  const { role, department, team, id: userId, organizationId = ORGANIZATION_ID } = req.user;
  
  const targetOrganization = (req.query && (req.query.organizationId || req.query.orgId))
    || (req.body && (req.body.organizationId || req.body.orgId));

  if (targetOrganization && targetOrganization !== organizationId) {
    return res.status(403).json({ success: false, message: 'Access Denied: Cross-organization access is forbidden.' });
  }

  // Admin and HR can access any record inside their organization.
  if (role === 'ADMIN' || role === 'HR') {
    return next();
  }

  // Employee can only access their own resources
  const targetEmployeeId = (req.query && req.query.employeeId) || (req.body && req.body.employeeId) || (req.params && (req.params.employeeId || req.params.id));
  const targetDept = (req.query && req.query.department) || (req.body && req.body.department) || (req.params && req.params.department);
  const targetTeam = (req.query && req.query.team) || (req.body && req.body.team) || (req.params && req.params.team);

  if (role === 'EMPLOYEE') {
    if (targetEmployeeId && targetEmployeeId !== userId) {
      return res.status(403).json({ success: false, message: 'Access Denied: You can only access your own records.' });
    }
    return next();
  }

  // Manager and Team Lead targets are checked against the server-side employee record,
  // rather than trusting a client-supplied department/team value.
  if (role === 'MANAGER' || role === 'TEAM_LEAD') {
    if (targetDept && targetDept !== department) {
      return res.status(403).json({ success: false, message: 'Access Denied: Scoped to your department only.' });
    }
    if (targetTeam && role === 'TEAM_LEAD' && targetTeam !== team) {
      return res.status(403).json({ success: false, message: 'Access Denied: Scoped to your team only.' });
    }

    if (!targetEmployeeId) return next();

    return db.get(
      `SELECT department, team, organizationId FROM employees WHERE id = ?
       UNION ALL SELECT department, team, organizationId FROM users WHERE id = ? LIMIT 1`,
      [targetEmployeeId, targetEmployeeId],
      (err, target) => {
        if (err) return res.status(500).json({ success: false, message: 'Unable to validate access scope.' });
        if (!target || target.organizationId !== organizationId) {
          return res.status(403).json({ success: false, message: 'Access Denied: Target is outside your organization.' });
        }
        if (target.department !== department) {
          return res.status(403).json({ success: false, message: 'Access Denied: Scoped to your department only.' });
        }
        if (role === 'TEAM_LEAD' && target.team !== team) {
          return res.status(403).json({ success: false, message: 'Access Denied: Scoped to your team only.' });
        }
        return next();
      }
    );
  }

  return res.status(403).json({ success: false, message: 'Access Denied: Invalid scopes.' });
};
