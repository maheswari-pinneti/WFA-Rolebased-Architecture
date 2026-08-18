import db, { logAudit } from '../config/db.js';

const organizationId = (req) => req.user.organizationId || 'org-stackly';

/**
 * GET /api/employees/:id
 * Retrieve details for a single employee record by ID.
 */
export const getEmployeeById = (req, res) => {
  const { id } = req.params;
  db.get(
    'SELECT * FROM employees WHERE id = ? AND organizationId = ?',
    [id, organizationId(req)],
    (err, row) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (!row) return res.status(404).json({ success: false, message: 'Employee not found.' });
      return res.json({ success: true, data: row });
    }
  );
};

/**
 * POST /api/employees
 * Creates/Onboards a new employee in the SQLite database.
 */
export const createEmployee = (req, res) => {
  const { id, employeeCode, name, email, role, department, designation, status, avatar, joinDate, performanceScore, attendanceRate, team } = req.body || {};
  if (!id || !name || !email || !department) {
    return res.status(400).json({ success: false, message: 'Required fields: id, name, email, department.' });
  }

  const orgId = organizationId(req);
  const code = employeeCode || `STK-${new Date().getFullYear()}-${name.substring(0, 2).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;

  db.run(
    `INSERT INTO employees (id, employeeCode, name, email, role, department, designation, status, avatar, joinDate, performanceScore, attendanceRate, team, organizationId)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, code, name, email, role || 'EMPLOYEE', department, designation || 'Specialist', status || 'ACTIVE', avatar || null, joinDate || new Date().toISOString().split('T')[0], performanceScore || 90, attendanceRate || 95, team || 'Frontend Team', orgId],
    function onCreate(err) {
      if (err) return res.status(500).json({ success: false, message: err.message });
      logAudit(req.user.id, 'EMPLOYEE_CREATE', `Created employee profile for ${name} (${id})`, orgId);
      return res.status(201).json({ success: true, data: { id, employeeCode: code, name, email, role, department, designation, status, team } });
    }
  );
};

/**
 * PUT /api/employees/:id
 * Updates an employee's details.
 */
export const updateEmployee = (req, res) => {
  const { id } = req.params;
  const { name, email, role, department, designation, status, team } = req.body || {};

  db.run(
    `UPDATE employees 
     SET name = COALESCE(?, name), email = COALESCE(?, email), role = COALESCE(?, role), 
         department = COALESCE(?, department), designation = COALESCE(?, designation), 
         status = COALESCE(?, status), team = COALESCE(?, team)
     WHERE id = ? AND organizationId = ?`,
    [name, email, role, department, designation, status, team, id, organizationId(req)],
    function onUpdate(err) {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (!this.changes) return res.status(404).json({ success: false, message: 'Employee not found.' });

      db.get('SELECT * FROM employees WHERE id = ? AND organizationId = ?', [id, organizationId(req)], (getErr, row) => {
        if (getErr) return res.status(500).json({ success: false, message: getErr.message });
        logAudit(req.user.id, 'EMPLOYEE_UPDATE', `Updated employee profile: ${id}`, organizationId(req));
        return res.json({ success: true, data: row });
      });
    }
  );
};

/**
 * DELETE /api/employees/:id
 * Removes/Deactivates an employee from the roster.
 */
export const deleteEmployee = (req, res) => {
  const { id } = req.params;
  db.run(
    'DELETE FROM employees WHERE id = ? AND organizationId = ?',
    [id, organizationId(req)],
    function onDelete(err) {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (!this.changes) return res.status(404).json({ success: false, message: 'Employee not found.' });
      logAudit(req.user.id, 'EMPLOYEE_DELETE', `Deleted employee: ${id}`, organizationId(req));
      return res.json({ success: true, message: 'Employee successfully deleted.' });
    }
  );
};

/**
 * GET /api/teams
 * Lists all active teams mapped to the organization/department.
 */
export const getTeams = (req, res) => {
  db.all(
    'SELECT DISTINCT team AS name, department FROM employees WHERE organizationId = ? AND team IS NOT NULL ORDER BY team',
    [organizationId(req)],
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.json({ success: true, data: rows });
    }
  );
};

/**
 * GET /api/teams/:id/members
 * Retrieves list of employee members in a specific team.
 */
export const getTeamMembers = (req, res) => {
  const { id } = req.params; // 'id' maps to team name in this flat structure
  db.all(
    'SELECT * FROM employees WHERE team = ? AND organizationId = ? ORDER BY CAST(SUBSTR(employeeCode, -4) AS INTEGER) ASC',
    [id, organizationId(req)],
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.json({ success: true, data: rows });
    }
  );
};
