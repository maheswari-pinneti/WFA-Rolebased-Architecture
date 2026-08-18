import { Attendance, Correction } from '../models/Attendance.js';
import { Shift } from '../models/Department.js';
import { AuditLog } from '../models/AuditLog.js';

export class AttendanceRepository {
  async findActiveSession(employeeId, orgId) {
    return Attendance.findOne({
      employeeId,
      organizationId: orgId,
      status: { $ne: 'Checked Out' }
    });
  }

  async findRecordById(id, orgId) {
    return Attendance.findOne({ id, organizationId: orgId });
  }

  async findRecordByIdempotencyKey(idempotencyKey, orgId) {
    return Attendance.findOne({ idempotencyKey, organizationId: orgId });
  }

  async createRecord(recordData) {
    return Attendance.create(recordData);
  }

  async findRecords(query) {
    return Attendance.find(query).sort({ date: -1, checkInTime: -1 });
  }

  async findTodayRecord(employeeId, todayDate, orgId) {
    return Attendance.findOne({
      employeeId,
      date: todayDate,
      organizationId: orgId
    }).sort({ checkInTime: -1 });
  }

  // Corrections
  async createCorrection(correctionData) {
    return Correction.create(correctionData);
  }

  async findCorrectionById(id, orgId) {
    return Correction.findOne({ id, organizationId: orgId });
  }

  async findCorrections(query) {
    return Correction.find(query).sort({ createdAt: -1 });
  }

  // Shifts
  async findShifts(orgId) {
    return Shift.find({ organizationId: orgId }).sort({ name: 1 });
  }

  // Audit Logs
  async createAuditLog(logData) {
    return AuditLog.create(logData);
  }

  async findAuditLogs(query, limit = 250) {
    return AuditLog.find(query).sort({ timestamp: -1 }).limit(limit);
  }
}

export const attendanceRepository = new AttendanceRepository();
export default attendanceRepository;
