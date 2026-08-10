import db, { logAudit } from '../config/db.js';

const organizationId = (req) => req.user.organizationId || 'org-stackly';

const findIdentity = (employeeId, callback) => {
  db.get(
    `SELECT id, name, department, team, organizationId FROM employees WHERE id = ?
     UNION ALL SELECT id, name, department, team, organizationId FROM users WHERE id = ? LIMIT 1`,
    [employeeId, employeeId],
    callback
  );
};

const scopeQuery = (req, table, alias = '') => {
  const prefix = alias ? `${alias}.` : '';
  let sql = `SELECT ${alias ? `${alias}.*` : '*'} FROM ${table} ${alias} WHERE ${prefix}organizationId = ?`;
  const params = [organizationId(req)];
  if (req.user.role === 'EMPLOYEE') {
    sql += ` AND ${prefix}employeeId = ?`;
    params.push(req.user.id);
  } else if (req.user.role === 'TEAM_LEAD') {
    sql += ` AND ${prefix}team = ?`;
    params.push(req.user.team);
  } else if (req.user.role === 'MANAGER') {
    sql += ` AND ${prefix}department = ?`;
    params.push(req.user.department);
  }
  return { sql, params };
};

export const getLeaveRequests = (req, res) => {
  const scope = scopeQuery(req, 'leave_requests');
  scope.sql += ' ORDER BY createdAt DESC';
  db.all(scope.sql, scope.params, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    return res.json({ success: true, data: rows });
  });
};

export const createLeaveRequest = (req, res) => {
  const body = req.body || {};
  const employeeId = req.user.role === 'EMPLOYEE' ? req.user.id : body.employeeId;
  const { type, startDate, endDate, reason } = body;
  if (!employeeId || !type || !startDate || !endDate || !reason?.trim()) {
    return res.status(400).json({ success: false, message: 'Leave type, dates and reason are required.' });
  }
  if (new Date(endDate) < new Date(startDate)) {
    return res.status(400).json({ success: false, message: 'End date cannot be before start date.' });
  }

  findIdentity(employeeId, (identityError, identity) => {
    if (identityError) return res.status(500).json({ success: false, message: identityError.message });
    if (!identity || identity.organizationId !== organizationId(req)) {
      return res.status(403).json({ success: false, message: 'Employee is outside the active organization.' });
    }
    if (req.user.role === 'MANAGER' && identity.department !== req.user.department) {
      return res.status(403).json({ success: false, message: 'Leave request is outside your department.' });
    }
    if (req.user.role === 'TEAM_LEAD' && identity.team !== req.user.team) {
      return res.status(403).json({ success: false, message: 'Leave request is outside your team.' });
    }
    const id = `leave-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const createdAt = new Date().toISOString();
    db.run(
      `INSERT INTO leave_requests (id,employeeId,employeeName,department,team,organizationId,type,startDate,endDate,reason,status,createdAt)
       VALUES (?,?,?,?,?,?,?,?,?,?, 'PENDING', ?)`,
      [id, employeeId, identity.name, identity.department, identity.team, organizationId(req), type, startDate, endDate, reason.trim(), createdAt],
      (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        logAudit(employeeId, 'LEAVE_REQUESTED', `Submitted ${type} leave request for ${startDate} to ${endDate}`, organizationId(req));
        return res.status(201).json({ success: true, data: { id, employeeId, employeeName: identity.name, type, startDate, endDate, reason: reason.trim(), status: 'PENDING', createdAt } });
      }
    );
  });
};

export const reviewLeaveRequest = (req, res) => {
  const { status, reviewComment = '' } = req.body || {};
  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Status must be APPROVED or REJECTED.' });
  }
  db.get('SELECT * FROM leave_requests WHERE id = ? AND organizationId = ?', [req.params.id, organizationId(req)], (err, request) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!request) return res.status(404).json({ success: false, message: 'Leave request not found.' });
    if (request.status !== 'PENDING') return res.status(409).json({ success: false, message: 'Leave request has already been reviewed.' });
    if (req.user.role === 'MANAGER' && request.department !== req.user.department) return res.status(403).json({ success: false, message: 'Leave request is outside your department.' });
    if (req.user.role === 'TEAM_LEAD' && request.team !== req.user.team) return res.status(403).json({ success: false, message: 'Leave request is outside your team.' });
    db.run(
      `UPDATE leave_requests SET status = ?, reviewedBy = ?, reviewComment = ? WHERE id = ? AND organizationId = ? AND status = 'PENDING'`,
      [status, req.user.name, reviewComment, req.params.id, organizationId(req)],
      function onUpdate(updateError) {
        if (updateError) return res.status(500).json({ success: false, message: updateError.message });
        if (!this.changes) return res.status(409).json({ success: false, message: 'Leave request was already reviewed.' });
        logAudit(request.employeeId, `LEAVE_${status}`, `${req.user.name} reviewed leave request ${request.id}`, organizationId(req));
        return res.json({ success: true, data: { ...request, status, reviewedBy: req.user.name, reviewComment } });
      }
    );
  });
};

export const getTasks = (req, res) => {
  const scope = scopeQuery(req, 'tasks');
  scope.sql += ' ORDER BY updatedAt DESC, priority DESC';
  db.all(scope.sql, scope.params, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    return res.json({ success: true, data: rows });
  });
};

export const updateTask = (req, res) => {
  const { status } = req.body || {};
  if (!['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid task status.' });
  }
  db.get('SELECT * FROM tasks WHERE id = ? AND organizationId = ?', [req.params.id, organizationId(req)], (err, task) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    const canManage = ['ADMIN', 'HR', 'MANAGER', 'TEAM_LEAD'].includes(req.user.role);
    const canUpdateOwn = req.user.role === 'EMPLOYEE' && task.assigneeId === req.user.id;
    if (!canManage && !canUpdateOwn) return res.status(403).json({ success: false, message: 'Task is outside your access scope.' });
    if (req.user.role === 'MANAGER' && task.department !== req.user.department) return res.status(403).json({ success: false, message: 'Task is outside your department.' });
    if (req.user.role === 'TEAM_LEAD' && task.team !== req.user.team) return res.status(403).json({ success: false, message: 'Task is outside your team.' });
    db.run('UPDATE tasks SET status = ?, updatedAt = ? WHERE id = ? AND organizationId = ?', [status, new Date().toISOString(), req.params.id, organizationId(req)], (updateError) => {
      if (updateError) return res.status(500).json({ success: false, message: updateError.message });
      logAudit(req.user.id, 'TASK_UPDATED', `Updated task ${req.params.id} to ${status}`, organizationId(req));
      return res.json({ success: true, data: { ...task, status, updatedAt: new Date().toISOString() } });
    });
  });
};
