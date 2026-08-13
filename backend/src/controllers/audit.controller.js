import db from '../config/db.js';

const organizationId = (req) => req.user.organizationId || 'org-stackly';

/**
 * GET /api/audit/logs
 * Retrieves organization-wide historical activity logs.
 */
export const getAuditLogs = (req, res) => {
  db.all(
    'SELECT * FROM audit_logs WHERE organizationId = ? ORDER BY timestamp DESC LIMIT 100',
    [organizationId(req)],
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.json({ success: true, data: rows });
    }
  );
};

/**
 * GET /api/audit/logs/:id
 * Retrieves detail for a specific audit log record.
 */
export const getAuditLogDetail = (req, res) => {
  const { id } = req.params;
  db.get(
    'SELECT * FROM audit_logs WHERE id = ? AND organizationId = ?',
    [id, organizationId(req)],
    (err, row) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (!row) return res.status(404).json({ success: false, message: 'Audit log not found.' });
      return res.json({ success: true, data: row });
    }
  );
};
