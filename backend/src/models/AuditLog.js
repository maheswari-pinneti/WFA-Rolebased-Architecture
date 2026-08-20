import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  timestamp: { type: String, required: true, index: true },
  employeeId: { type: String, default: null },
  action: { type: String, default: null },
  details: { type: String, default: null },
  organizationId: { type: String, default: 'org-stackly' },
  companyId: { type: String, default: 'org-stackly', index: true }
}, { timestamps: true, collection: 'audit_logs' });

export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
