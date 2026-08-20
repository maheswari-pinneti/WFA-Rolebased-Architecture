import mongoose from 'mongoose';

const attendanceRecordSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  employeeId: { type: String, required: true, index: true },
  employeeName: { type: String, default: null },
  department: { type: String, default: null },
  date: { type: String, required: true, index: true },
  checkInTime: { type: String, default: null },
  checkOutTime: { type: String, default: null },
  breaks: { type: mongoose.Schema.Types.Mixed, default: [] },
  shiftType: { type: String, default: 'Regular' },
  workMode: { type: String, default: 'Office' },
  status: { type: String, default: 'Checked Out' },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  accuracy: { type: Number, default: null },
  idempotencyKey: { type: String, unique: true, sparse: true },
  team: { type: String, default: null },
  organizationId: { type: String, default: 'org-stackly' },
  companyId: { type: String, default: 'org-stackly', index: true }
}, {
  timestamps: true,
  collection: 'attendancerecords'
});

const correctionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  employeeId: { type: String, required: true, index: true },
  employeeName: { type: String, default: null },
  department: { type: String, default: null },
  date: { type: String, required: true, index: true },
  requestedCheckIn: { type: String, default: null },
  requestedCheckOut: { type: String, default: null },
  reason: { type: String, default: null },
  status: { type: String, default: 'PENDING' },
  managerComment: { type: String, default: null },
  reviewedBy: { type: String, default: null },
  createdAt: { type: String, default: () => new Date().toISOString() },
  team: { type: String, default: null },
  organizationId: { type: String, default: 'org-stackly' },
  companyId: { type: String, default: 'org-stackly', index: true }
}, {
  timestamps: true,
  collection: 'correctionrequests'
});

const breakSessionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  companyId: { type: String, required: true, index: true },
  attendanceRecordId: { type: String, required: true, index: true },
  startTime: { type: String, required: true },
  endTime: { type: String, default: null },
  status: { type: String, default: 'ACTIVE' }
}, {
  timestamps: true,
  collection: 'breaksessions'
});

const attendanceEventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  companyId: { type: String, required: true, index: true },
  employeeId: { type: String, required: true, index: true },
  attendanceRecordId: { type: String, required: true, index: true },
  type: { type: String, required: true }, // 'CHECK_IN', 'BREAK_START', 'BREAK_END', 'CHECK_OUT'
  timestamp: { type: String, required: true }
}, {
  timestamps: true,
  collection: 'attendanceevents'
});

const idempotencyRecordSchema = new mongoose.Schema({
  companyId: { type: String, required: true, index: true },
  key: { type: String, required: true, index: true },
  statusCode: { type: Number, required: true },
  response: { type: mongoose.Schema.Types.Mixed, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } } // TTL index
}, {
  timestamps: true,
  collection: 'idempotencyrecords'
});

// Enforce compound unique index on companyId + key
idempotencyRecordSchema.index({ companyId: 1, key: 1 }, { unique: true });

export const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceRecordSchema);
export const Correction = mongoose.models.Correction || mongoose.model('Correction', correctionSchema);
export const BreakSession = mongoose.models.BreakSession || mongoose.model('BreakSession', breakSessionSchema);
export const AttendanceEvent = mongoose.models.AttendanceEvent || mongoose.model('AttendanceEvent', attendanceEventSchema);
export const IdempotencyRecord = mongoose.models.IdempotencyRecord || mongoose.model('IdempotencyRecord', idempotencyRecordSchema);
export default Attendance;
