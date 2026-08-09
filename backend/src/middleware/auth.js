import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'wfa_platform_secret_jwt_key_2026';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized access token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    req.user = user;
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

// Check if request complies with organization, department, and employee scopes
export const enforceScope = (req, res, next) => {
  const { role, department, id: userId } = req.user;
  
  // ADMIN and HR_MANAGER have organization-wide permissions
  if (role === 'ADMIN' || role === 'HR_MANAGER' || role === 'HR') {
    return next();
  }

  // Retrieve target scopes from request parameters
  const targetEmployeeId = (req.query && req.query.employeeId) || (req.body && req.body.employeeId) || (req.params && req.params.employeeId);
  const targetDept = (req.query && req.query.department) || (req.body && req.body.department) || (req.params && req.params.department);

  // EMPLOYEE is restricted to SELF
  if (role === 'EMPLOYEE') {
    if (targetEmployeeId && targetEmployeeId !== userId) {
      return res.status(403).json({ success: false, message: 'Access Denied: You can only access your own records.' });
    }
    return next();
  }

  // TEAM_MANAGER / MANAGER is restricted to their Department
  if (role === 'TEAM_MANAGER' || role === 'MANAGER') {
    if (targetDept && targetDept !== department) {
      return res.status(403).json({ success: false, message: 'Access Denied: Scoped to your department only.' });
    }
    return next();
  }

  // TEAM_LEAD is restricted to their Department AND Team
  if (role === 'TEAM_LEAD') {
    if (targetDept && targetDept !== department) {
      return res.status(403).json({ success: false, message: 'Access Denied: Scoped to your department only.' });
    }
    const targetTeam = (req.query && req.query.team) || (req.body && req.body.team) || (req.params && req.params.team);
    if (targetTeam && req.user.team && targetTeam !== req.user.team) {
      return res.status(403).json({ success: false, message: 'Access Denied: Scoped to your team only.' });
    }
    return next();
  }

  return res.status(403).json({ success: false, message: 'Access Denied: Invalid scopes.' });
};
