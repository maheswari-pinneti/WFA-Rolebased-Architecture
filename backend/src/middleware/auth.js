import jwt from 'jsonwebtoken';
import { Employee } from '../models/Employee.js';
import { User } from '../models/User.js';
import { env } from '../config/env.js';

const ORGANIZATION_ID = 'org-stackly';
const JWT_SECRET = env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized access token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    const orgId = user.organizationId || user.companyId || ORGANIZATION_ID;
    req.user = { ...user, organizationId: orgId, companyId: orgId };
    req.companyId = orgId;
    next();
  });
};

import { authorizeRoles, authorizePermissions, enforceScope } from './permission.js';

export { authorizeRoles, authorizePermissions, enforceScope };
