import { attendanceRepository } from '../repositories/attendance.repository.js';
import { employeeRepository } from '../repositories/employee.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { Attendance, Correction } from '../models/Attendance.js';
import { Employee } from '../models/Employee.js';
import { AuditLog } from '../models/AuditLog.js';
import { logAudit } from '../config/db.js';
import * as notificationService from './notification.service.js';

const OFFICE_COORDS = { lat: 12.9716, lng: 77.5946 };
const ALLOWED_RADIUS_METERS = 100;
const MAX_LOCATION_ACCURACY_METERS = 100;

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(deltaPhi / 2) ** 2
    + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export class AttendanceService {
  async findIdentity(employeeId, orgId) {
    let identity = await employeeRepository.findById(employeeId, orgId);
    if (!identity) {
      identity = await userRepository.findById(employeeId, orgId);
    }
    return identity;
  }

  async checkIn(reqUser, punchData) {
    const { role, id: userId, organizationId } = reqUser;
    const orgId = organizationId || 'org-stackly';
    const employeeId = role === 'EMPLOYEE' ? userId : punchData.employeeId;
    const { shiftType, workMode, latitude, longitude, accuracy, idempotencyKey } = punchData;

    if (!employeeId || !shiftType || !workMode) {
      throw new Error('Employee, shift and work mode are required.');
    }

    const identity = await this.findIdentity(employeeId, orgId);
    if (!identity) {
      throw new Error('Employee is outside the active organization.');
    }

    if (workMode === 'Office') {
      if (latitude === undefined || longitude === undefined) {
        logAudit(employeeId, 'GEOFENCE_VIOLATION', 'Office check-in rejected: missing coordinates', orgId);
        notificationService.triggerAlarm(employeeId, identity.name, 'GEOFENCE_VIOLATION', 'Office check-in attempted without coordinates.');
        throw new Error('Location coordinates required for Office check-in.');
      }
      if (accuracy !== undefined && (!Number.isFinite(Number(accuracy)) || Number(accuracy) > MAX_LOCATION_ACCURACY_METERS)) {
        throw new Error('Location accuracy is insufficient for Office check-in.');
      }
      const distance = getDistance(latitude, longitude, OFFICE_COORDS.lat, OFFICE_COORDS.lng);
      if (distance > ALLOWED_RADIUS_METERS) {
        logAudit(employeeId, 'GEOFENCE_VIOLATION', `Office check-in rejected: ${Math.round(distance)}m away`, orgId);
        notificationService.triggerAlarm(employeeId, identity.name, 'GEOFENCE_VIOLATION', `Office check-in rejected: ${Math.round(distance)}m away`);
        throw new Error(`Geofencing validation failed. You are outside the office boundary (${Math.round(distance)}m away).`);
      }
    }

    if (idempotencyKey) {
      const existing = await attendanceRepository.findRecordByIdempotencyKey(idempotencyKey, orgId);
      if (existing) {
        return { data: existing, idempotentReplay: true };
      }
    }

    const activeSession = await attendanceRepository.findActiveSession(employeeId, orgId);
    if (activeSession) {
      notificationService.triggerAlarm(employeeId, identity.name, 'DUPLICATE_CHECKIN_ATTEMPT', 'Active session already exists.');
      throw new Error('Active session already exists. Must check out first.');
    }

    const id = Math.random().toString(36).slice(2, 11);
    const date = new Date().toISOString().split('T')[0];
    const checkInTime = new Date().toISOString();

    const record = await attendanceRepository.createRecord({
      id,
      employeeId,
      employeeName: identity.name,
      department: identity.department,
      date,
      checkInTime,
      checkOutTime: null,
      breaks: [],
      shiftType,
      workMode,
      status: 'Checked In',
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      accuracy: accuracy ?? null,
      idempotencyKey: idempotencyKey || null,
      team: identity.team,
      organizationId: orgId
    });

    logAudit(employeeId, 'CHECK_IN', `Checked in using ${workMode} mode on ${shiftType} shift`, orgId);
    notificationService.triggerGoogleCalendarNotification(employeeId, identity.name, 'Office Login Check-In', date);
    return { data: record, idempotentReplay: false };
  }

  async takeBreak(reqUser, bodyData) {
    const orgId = reqUser.organizationId || 'org-stackly';
    const employeeId = reqUser.role === 'EMPLOYEE' ? reqUser.id : bodyData.employeeId;

    const session = await attendanceRepository.findActiveSession(employeeId, orgId);
    if (!session) {
      throw new Error('No active check-in session found.');
    }
    if (session.status === 'On Break') {
      throw new Error('Already on break.');
    }

    const breaksList = Array.isArray(session.breaks) ? [...session.breaks] : [];
    breaksList.push({ start: new Date().toISOString(), end: null });

    session.status = 'On Break';
    session.breaks = breaksList;
    await session.save();

    logAudit(employeeId, 'BREAK_START', 'Started break', orgId);
    return session;
  }

  async resumeWork(reqUser, bodyData) {
    const orgId = reqUser.organizationId || 'org-stackly';
    const employeeId = reqUser.role === 'EMPLOYEE' ? reqUser.id : bodyData.employeeId;

    const session = await Attendance.findOne({ employeeId, organizationId: orgId, status: 'On Break' });
    if (!session) {
      throw new Error('Employee is not on an active break.');
    }

    const breaksList = Array.isArray(session.breaks) ? [...session.breaks] : [];
    const activeBreak = breaksList.find((item) => item.end === null);
    if (activeBreak) {
      activeBreak.end = new Date().toISOString();
    }

    session.status = 'Working';
    session.breaks = breaksList;
    await session.save();

    logAudit(employeeId, 'BREAK_END', 'Resumed work', orgId);
    return session;
  }

  async checkOut(reqUser, bodyData) {
    const orgId = reqUser.organizationId || 'org-stackly';
    const employeeId = reqUser.role === 'EMPLOYEE' ? reqUser.id : bodyData.employeeId;

    const session = await attendanceRepository.findActiveSession(employeeId, orgId);
    if (!session) {
      throw new Error('Check-out-before-check-in rejection. No active session found.');
    }

    const breaksList = Array.isArray(session.breaks) ? [...session.breaks] : [];
    const activeBreak = breaksList.find((item) => item.end === null);
    if (activeBreak) {
      activeBreak.end = new Date().toISOString();
    }

    const checkOutTime = new Date().toISOString();
    session.status = 'Checked Out';
    session.checkOutTime = checkOutTime;
    session.breaks = breaksList;
    await session.save();

    logAudit(employeeId, 'CHECK_OUT', 'Checked out from active session', orgId);
    return session;
  }

  async getRecords(reqUser) {
    const { role, id: employeeId, department, team, organizationId } = reqUser;
    const query = { organizationId: organizationId || 'org-stackly' };

    if (role === 'EMPLOYEE') {
      query.employeeId = employeeId;
    } else if (role === 'TEAM_LEAD') {
      query.team = team;
    } else if (role === 'MANAGER') {
      query.department = department;
    }

    return attendanceRepository.findRecords(query);
  }

  async getTodayAttendance(userId, orgId) {
    const todayDate = new Date().toISOString().split('T')[0];
    return attendanceRepository.findTodayRecord(userId, todayDate, orgId);
  }

  // Corrections
  async submitCorrection(reqUser, bodyData) {
    const { role, id: userId, organizationId } = reqUser;
    const orgId = organizationId || 'org-stackly';
    const employeeId = role === 'EMPLOYEE' ? userId : bodyData.employeeId;
    const { date, requestedCheckIn, requestedCheckOut, reason } = bodyData;

    if (!employeeId || !date || !requestedCheckIn || !requestedCheckOut || !reason) {
      throw new Error('Complete correction details are required.');
    }

    const identity = await this.findIdentity(employeeId, orgId);
    if (!identity) {
      throw new Error('Employee is outside the active organization.');
    }

    const id = Math.random().toString(36).slice(2, 11);
    const createdAt = new Date().toISOString();

    const correction = await attendanceRepository.createCorrection({
      id,
      employeeId,
      employeeName: identity.name,
      department: identity.department,
      date,
      requestedCheckIn,
      requestedCheckOut,
      reason,
      status: 'Pending',
      managerComment: null,
      reviewedBy: null,
      createdAt,
      team: identity.team,
      organizationId: orgId
    });

    logAudit(employeeId, 'CORRECTION_REQUESTED', `Submitted correction request for ${date}`, orgId);
    return { id: correction.id, status: 'Pending' };
  }

  async reviewCorrection(reqUser, correctionId, status, managerComment) {
    const orgId = reqUser.organizationId || 'org-stackly';
    const correction = await attendanceRepository.findCorrectionById(correctionId, orgId);
    if (!correction) {
      throw new Error('Correction request not found.');
    }

    if (reqUser.role === 'MANAGER' && correction.department !== reqUser.department) {
      throw new Error('Correction is outside your department.');
    }
    if (reqUser.role === 'TEAM_LEAD' && correction.team !== reqUser.team) {
      throw new Error('Correction is outside your team.');
    }
    if (correction.status !== 'Pending') {
      throw new Error('Correction has already been reviewed.');
    }

    const reviewerName = reqUser.name;
    correction.status = status;
    correction.managerComment = managerComment || '';
    correction.reviewedBy = reviewerName;
    await correction.save();

    if (status === 'Approved') {
      const checkInTime = new Date(`${correction.date}T${correction.requestedCheckIn}`).toISOString();
      const checkOutTime = new Date(`${correction.date}T${correction.requestedCheckOut}`).toISOString();

      const existingRecord = await Attendance.findOne({
        employeeId: correction.employeeId,
        date: correction.date,
        organizationId: orgId
      });

      if (existingRecord) {
        existingRecord.checkInTime = checkInTime;
        existingRecord.checkOutTime = checkOutTime;
        existingRecord.status = 'Checked Out';
        await existingRecord.save();
      } else {
        const recordId = Math.random().toString(36).slice(2, 11);
        await attendanceRepository.createRecord({
          id: recordId,
          employeeId: correction.employeeId,
          employeeName: correction.employeeName,
          department: correction.department,
          date: correction.date,
          checkInTime,
          checkOutTime,
          breaks: [],
          shiftType: 'Regular',
          workMode: 'Office',
          status: 'Checked Out',
          team: correction.team,
          organizationId: orgId
        });
      }
    }

    logAudit(correction.employeeId, `CORRECTION_${status.toUpperCase()}`, `${reviewerName} reviewed correction request`, orgId);
  }

  async getCorrections(reqUser) {
    const { role, id: employeeId, department, team, organizationId } = reqUser;
    const query = { organizationId: organizationId || 'org-stackly' };

    if (role === 'EMPLOYEE') {
      query.employeeId = employeeId;
    } else if (role === 'TEAM_LEAD') {
      query.team = team;
    } else if (role === 'MANAGER') {
      query.department = department;
    }

    return attendanceRepository.findCorrections(query);
  }

  async getShifts(orgId) {
    return attendanceRepository.findShifts(orgId);
  }

  async getAuditLogs(reqUser) {
    const { role, id: employeeId, department, team, organizationId } = reqUser;
    const orgId = organizationId || 'org-stackly';

    let employeeIds = null;
    if (role === 'TEAM_LEAD') {
      const emps = await employeeRepository.findTeamMembers(team, orgId);
      employeeIds = emps.map((e) => e.id);
    } else if (role === 'MANAGER') {
      const emps = await Employee.find({ department, organizationId: orgId }, { id: 1 });
      employeeIds = emps.map((e) => e.id);
    }

    const query = { organizationId: orgId };
    if (role === 'EMPLOYEE') {
      query.employeeId = employeeId;
    } else if (employeeIds) {
      query.employeeId = { $in: employeeIds };
    }

    return attendanceRepository.findAuditLogs(query);
  }
}

export const attendanceService = new AttendanceService();
export default attendanceService;
