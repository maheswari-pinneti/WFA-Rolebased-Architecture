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
  idempotencyKey: { type: String, default: null, unique: true, sparse: true },
  team: { type: String, default: null },
  organizationId: { type: String, default: 'org-stackly' }
}, {
  timestamps: true,
  collection: 'attendance'
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
  organizationId: { type: String, default: 'org-stackly' }
}, {
  timestamps: true,
  collection: 'corrections'
});

export const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceRecordSchema);
export const Correction = mongoose.models.Correction || mongoose.model('Correction', correctionSchema);
export default Attendance;
