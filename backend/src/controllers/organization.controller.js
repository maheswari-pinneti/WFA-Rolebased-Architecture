import db, { logAudit } from '../config/db.js';

const organizationId = (req) => req.user.organizationId || 'org-stackly';

/**
 * GET /api/departments
 * Lists unique departments based on loaded employee assignments.
 */
export const getDepartments = (req, res) => {
  db.all(
    'SELECT DISTINCT department AS name FROM employees WHERE organizationId = ? AND department IS NOT NULL ORDER BY department',
    [organizationId(req)],
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.json({ success: true, data: rows });
    }
  );
};

/**
 * GET /api/organizations
 * Retrieves top-level organization scope details.
 */
export const getOrganizations = (req, res) => {
  const currentOrg = organizationId(req);
  db.get(
    'SELECT * FROM employees WHERE organizationId = ? LIMIT 1',
    [currentOrg],
    (err, row) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.json({
        success: true,
        data: [{
          id: currentOrg,
          name: 'Stackly Enterprise HQ',
          domain: 'thestackly.com',
          status: 'ACTIVE'
        }]
      });
    }
  );
};

/**
 * GET /api/roles
 * Lists available user roles in the system.
 */
export const getRoles = (req, res) => {
  return res.json({
    success: true,
    data: [
      { role: 'ADMIN', label: 'System Administrator', clearanceLevel: 5 },
      { role: 'HR', label: 'HR Operations Manager', clearanceLevel: 4 },
      { role: 'MANAGER', label: 'Department Manager', clearanceLevel: 3 },
      { role: 'TEAM_LEAD', label: 'Team Lead', clearanceLevel: 2 },
      { role: 'EMPLOYEE', label: 'Full Stack Developer', clearanceLevel: 1 }
    ]
  });
};

/**
 * GET /api/permissions
 * Lists system permission definitions.
 */
export const getPermissions = (req, res) => {
  return res.json({
    success: true,
    data: [
      { permission: 'USER_CREATE', description: 'Create user profiles' },
      { permission: 'USER_UPDATE', description: 'Update user profiles' },
      { permission: 'USER_DELETE', description: 'Deactivate user profiles' },
      { permission: 'EMPLOYEE_VIEW_ALL', description: 'Access global employee directory' },
      { permission: 'VIEW_ALL_DATA', description: 'Cross-department operations' }
    ]
  });
};
