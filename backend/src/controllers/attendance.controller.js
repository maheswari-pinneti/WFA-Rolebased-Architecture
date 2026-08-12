import db, { logAudit } from '../config/db.js';
import * as notificationService from '../services/notification.service.js';

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

const organizationId = (req) => req.user.organizationId || 'org-stackly';

const parseRecord = (record) => ({ ...record, breaks: JSON.parse(record.breaks || '[]') });

const findIdentity = (employeeId, callback) => {
  db.get(
    `SELECT id, name, department, team, organizationId FROM employees WHERE id = ?
     UNION ALL SELECT id, name, department, team, organizationId FROM users WHERE id = ? LIMIT 1`,
    [employeeId, employeeId],
    callback
  );
};

export const checkIn = (req, res) => {
  const body = req.body || {};
  const employeeId = req.user.role === 'EMPLOYEE' ? req.user.id : body.employeeId;
  const { shiftType, workMode, latitude, longitude, accuracy, idempotencyKey } = body;
  if (!employeeId || !shiftType || !workMode) {
    return res.status(400).json({ success: false, message: 'Employee, shift and work mode are required.' });
  }

  findIdentity(employeeId, (identityError, identity) => {
    if (identityError) return res.status(500).json({ success: false, message: identityError.message });
    if (!identity || identity.organizationId !== organizationId(req)) {
      return res.status(403).json({ success: false, message: 'Employee is outside the active organization.' });
    }

    if (workMode === 'Office') {
      if (latitude === undefined || longitude === undefined) {
        logAudit(employeeId, 'GEOFENCE_VIOLATION', 'Office check-in rejected: missing coordinates', organizationId(req));
        notificationService.triggerAlarm(employeeId, identity.name, 'GEOFENCE_VIOLATION', 'Office check-in attempted without coordinates.');
        return res.status(400).json({ success: false, message: 'Location coordinates required for Office check-in.' });
      }
      if (accuracy !== undefined && (!Number.isFinite(Number(accuracy)) || Number(accuracy) > MAX_LOCATION_ACCURACY_METERS)) {
        return res.status(400).json({ success: false, message: 'Location accuracy is insufficient for Office check-in.' });
      }
      const distance = getDistance(latitude, longitude, OFFICE_COORDS.lat, OFFICE_COORDS.lng);
      if (distance > ALLOWED_RADIUS_METERS) {
        logAudit(employeeId, 'GEOFENCE_VIOLATION', `Office check-in rejected: ${Math.round(distance)}m away`, organizationId(req));
        notificationService.triggerAlarm(employeeId, identity.name, 'GEOFENCE_VIOLATION', `Office check-in rejected: ${Math.round(distance)}m away`);
        return res.status(400).json({ success: false, message: `Geofencing validation failed. You are outside the office boundary (${Math.round(distance)}m away).` });
      }
    }

    const proceed = () => db.get(
      `SELECT * FROM attendance_records WHERE employeeId = ? AND organizationId = ? AND status != 'Checked Out'`,
      [employeeId, organizationId(req)],
      (activeError, activeSession) => {
        if (activeError) return res.status(500).json({ success: false, message: activeError.message });
        if (activeSession) {
          notificationService.triggerAlarm(employeeId, identity.name, 'DUPLICATE_CHECKIN_ATTEMPT', 'Active session already exists.');
          return res.status(400).json({ success: false, message: 'Active session already exists. Must check out first.' });
        }

        const id = Math.random().toString(36).slice(2, 11);
        const date = new Date().toISOString().split('T')[0];
        const checkInTime = new Date().toISOString();
        db.run(
          `INSERT INTO attendance_records
           (id,employeeId,employeeName,department,date,checkInTime,checkOutTime,breaks,shiftType,workMode,status,latitude,longitude,accuracy,idempotencyKey,team,organizationId)
           VALUES (?,?,?,?,?,?,NULL,'[]',?,?,?,?,?,?,?, ?,?)`,
          [id, employeeId, identity.name, identity.department, date, checkInTime, shiftType, workMode, 'Checked In', latitude ?? null, longitude ?? null, accuracy ?? null, idempotencyKey || null, identity.team, organizationId(req)],
          (insertError) => {
            if (insertError) {
              if (insertError.code === 'SQLITE_CONSTRAINT') {
                return db.get('SELECT * FROM attendance_records WHERE idempotencyKey = ? AND organizationId = ?', [idempotencyKey, organizationId(req)], (lookupError, existing) => {
                  if (lookupError || !existing) return res.status(409).json({ success: false, message: 'Duplicate attendance request.' });
                  return res.json({ success: true, data: parseRecord(existing), idempotentReplay: true });
                });
              }
              return res.status(500).json({ success: false, message: insertError.message });
            }
            logAudit(employeeId, 'CHECK_IN', `Checked in using ${workMode} mode on ${shiftType} shift`, organizationId(req));
            notificationService.triggerGoogleCalendarNotification(employeeId, identity.name, 'Office Login Check-In', date);
            return res.json({ success: true, data: { id, employeeId, employeeName: identity.name, department: identity.department, team: identity.team, date, checkInTime, status: 'Checked In', breaks: [] } });
          }
        );
      }
    );

    if (idempotencyKey) {
      return db.get('SELECT * FROM attendance_records WHERE idempotencyKey = ? AND organizationId = ?', [idempotencyKey, organizationId(req)], (lookupError, existing) => {
        if (lookupError) return res.status(500).json({ success: false, message: lookupError.message });
        if (existing) return res.json({ success: true, data: parseRecord(existing), idempotentReplay: true });
        return proceed();
      });
    }
    return proceed();
  });
};

export const takeBreak = (req, res) => {
  const employeeId = req.user.role === 'EMPLOYEE' ? req.user.id : req.body.employeeId;
  db.get(`SELECT * FROM attendance_records WHERE employeeId = ? AND organizationId = ? AND status != 'Checked Out'`, [employeeId, organizationId(req)], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(400).json({ success: false, message: 'No active check-in session found.' });
    if (row.status === 'On Break') return res.status(400).json({ success: false, message: 'Already on break.' });
    const breaks = JSON.parse(row.breaks || '[]');
    breaks.push({ start: new Date().toISOString(), end: null });
    db.run(`UPDATE attendance_records SET status = 'On Break', breaks = ? WHERE id = ? AND organizationId = ?`, [JSON.stringify(breaks), row.id, organizationId(req)], (updateError) => {
      if (updateError) return res.status(500).json({ success: false, message: updateError.message });
      logAudit(employeeId, 'BREAK_START', 'Started break', organizationId(req));
      return res.json({ success: true, data: parseRecord({ ...row, status: 'On Break', breaks: JSON.stringify(breaks) }) });
    });
  });
};

export const resumeWork = (req, res) => {
  const employeeId = req.user.role === 'EMPLOYEE' ? req.user.id : req.body.employeeId;
  db.get(`SELECT * FROM attendance_records WHERE employeeId = ? AND organizationId = ? AND status = 'On Break'`, [employeeId, organizationId(req)], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(400).json({ success: false, message: 'Employee is not on an active break.' });
    const breaks = JSON.parse(row.breaks || '[]');
    const activeBreak = breaks.find((item) => item.end === null);
    if (activeBreak) activeBreak.end = new Date().toISOString();
    db.run(`UPDATE attendance_records SET status = 'Working', breaks = ? WHERE id = ? AND organizationId = ?`, [JSON.stringify(breaks), row.id, organizationId(req)], (updateError) => {
      if (updateError) return res.status(500).json({ success: false, message: updateError.message });
      logAudit(employeeId, 'BREAK_END', 'Resumed work', organizationId(req));
      return res.json({ success: true, data: parseRecord({ ...row, status: 'Working', breaks: JSON.stringify(breaks) }) });
    });
  });
};

export const checkOut = (req, res) => {
  const employeeId = req.user.role === 'EMPLOYEE' ? req.user.id : req.body.employeeId;
  db.get(`SELECT * FROM attendance_records WHERE employeeId = ? AND organizationId = ? AND status != 'Checked Out'`, [employeeId, organizationId(req)], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(400).json({ success: false, message: 'Check-out-before-check-in rejection. No active session found.' });
    const breaks = JSON.parse(row.breaks || '[]');
    const activeBreak = breaks.find((item) => item.end === null);
    if (activeBreak) activeBreak.end = new Date().toISOString();
    const checkOutTime = new Date().toISOString();
    db.run(`UPDATE attendance_records SET status = 'Checked Out', checkOutTime = ?, breaks = ? WHERE id = ? AND organizationId = ?`, [checkOutTime, JSON.stringify(breaks), row.id, organizationId(req)], (updateError) => {
      if (updateError) return res.status(500).json({ success: false, message: updateError.message });
      logAudit(employeeId, 'CHECK_OUT', 'Checked out from active session', organizationId(req));
      return res.json({ success: true, data: parseRecord({ ...row, status: 'Checked Out', checkOutTime, breaks: JSON.stringify(breaks) }) });
    });
  });
};

export const getRecords = (req, res) => {
  const { role, id: employeeId, department, team } = req.user;
  let sql = 'SELECT * FROM attendance_records WHERE organizationId = ?';
  const params = [organizationId(req)];
  if (role === 'EMPLOYEE') {
    sql += ' AND employeeId = ?'; params.push(employeeId);
  } else if (role === 'TEAM_LEAD') {
    sql += ' AND team = ?'; params.push(team);
  } else if (role === 'MANAGER') {
    sql += ' AND department = ?'; params.push(department);
  }
  sql += ' ORDER BY date DESC, checkInTime DESC';
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    return res.json({ success: true, data: rows.map(parseRecord) });
  });
};

/**
 * GET /api/attendance/today
 * Retrieves the current day's active/completed attendance record for the authenticated user.
 */
export const getTodayAttendance = (req, res) => {
  const employeeId = req.user.id;
  const todayDate = new Date().toISOString().split('T')[0];
  
  db.get(
    `SELECT * FROM attendance_records 
     WHERE employeeId = ? AND date = ? AND organizationId = ? 
     ORDER BY checkInTime DESC LIMIT 1`,
    [employeeId, todayDate, organizationId(req)],
    (err, row) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      return res.json({ success: true, data: row ? parseRecord(row) : null });
    }
  );
};

export const submitCorrection = (req, res) => {
  const body = req.body || {};
  const employeeId = req.user.role === 'EMPLOYEE' ? req.user.id : body.employeeId;
  const { date, requestedCheckIn, requestedCheckOut, reason } = body;
  if (!employeeId || !date || !requestedCheckIn || !requestedCheckOut || !reason) {
    return res.status(400).json({ success: false, message: 'Complete correction details are required.' });
  }
  findIdentity(employeeId, (identityError, identity) => {
    if (identityError) return res.status(500).json({ success: false, message: identityError.message });
    if (!identity || identity.organizationId !== organizationId(req)) return res.status(403).json({ success: false, message: 'Employee is outside the active organization.' });
    const id = Math.random().toString(36).slice(2, 11);
    const createdAt = new Date().toISOString();
    db.run(
      `INSERT INTO corrections (id,employeeId,employeeName,department,date,requestedCheckIn,requestedCheckOut,reason,status,managerComment,reviewedBy,createdAt,team,organizationId)
       VALUES (?,?,?,?,?,?,?,?,'Pending',NULL,NULL,?,?,?)`,
      [id, employeeId, identity.name, identity.department, date, requestedCheckIn, requestedCheckOut, reason, createdAt, identity.team, organizationId(req)],
      (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        logAudit(employeeId, 'CORRECTION_REQUESTED', `Submitted correction request for ${date}`, organizationId(req));
        return res.json({ success: true, data: { id, status: 'Pending' } });
      }
    );
  });
};

export const reviewCorrection = (req, res) => {
  const { status, managerComment } = req.body || {};
  if (!['Approved', 'Rejected'].includes(status)) return res.status(400).json({ success: false, message: 'Invalid correction status.' });
  db.get('SELECT * FROM corrections WHERE id = ? AND organizationId = ?', [req.params.id, organizationId(req)], (err, correction) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!correction) return res.status(404).json({ success: false, message: 'Correction request not found.' });
    if (req.user.role === 'MANAGER' && correction.department !== req.user.department) return res.status(403).json({ success: false, message: 'Correction is outside your department.' });
    if (req.user.role === 'TEAM_LEAD' && correction.team !== req.user.team) return res.status(403).json({ success: false, message: 'Correction is outside your team.' });
    if (correction.status !== 'Pending') return res.status(409).json({ success: false, message: 'Correction has already been reviewed.' });

    const reviewerName = req.user.name;
    db.run(`UPDATE corrections SET status = ?, managerComment = ?, reviewedBy = ? WHERE id = ? AND organizationId = ?`, [status, managerComment || '', reviewerName, req.params.id, organizationId(req)], (updateError) => {
      if (updateError) return res.status(500).json({ success: false, message: updateError.message });
      if (status === 'Approved') {
        const checkInTime = new Date(`${correction.date}T${correction.requestedCheckIn}`).toISOString();
        const checkOutTime = new Date(`${correction.date}T${correction.requestedCheckOut}`).toISOString();
        db.get('SELECT * FROM attendance_records WHERE employeeId = ? AND date = ? AND organizationId = ?', [correction.employeeId, correction.date, organizationId(req)], (lookupError, record) => {
          if (lookupError) return undefined;
          if (record) {
            return db.run(`UPDATE attendance_records SET checkInTime = ?, checkOutTime = ?, status = 'Checked Out' WHERE id = ? AND organizationId = ?`, [checkInTime, checkOutTime, record.id, organizationId(req)]);
          }
          const recordId = Math.random().toString(36).slice(2, 11);
          return db.run(
            `INSERT INTO attendance_records (id,employeeId,employeeName,department,date,checkInTime,checkOutTime,breaks,shiftType,workMode,status,team,organizationId)
             VALUES (?,?,?,?,?,?,?,'[]','Regular','Office','Checked Out',?,?)`,
            [recordId, correction.employeeId, correction.employeeName, correction.department, correction.date, checkInTime, checkOutTime, correction.team, organizationId(req)]
          );
        });
      }
      logAudit(correction.employeeId, `CORRECTION_${status.toUpperCase()}`, `${reviewerName} reviewed correction request`, organizationId(req));
      return res.json({ success: true, message: `Request successfully ${status}.` });
    });
  });
};

export const getCorrections = (req, res) => {
  const { role, id: employeeId, department, team } = req.user;
  let sql = 'SELECT * FROM corrections WHERE organizationId = ?';
  const params = [organizationId(req)];
  if (role === 'EMPLOYEE') { sql += ' AND employeeId = ?'; params.push(employeeId); }
  else if (role === 'TEAM_LEAD') { sql += ' AND team = ?'; params.push(team); }
  else if (role === 'MANAGER') { sql += ' AND department = ?'; params.push(department); }
  sql += ' ORDER BY createdAt DESC';
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    return res.json({ success: true, data: rows });
  });
};

export const getShifts = (req, res) => {
  db.all('SELECT * FROM shifts WHERE organizationId = ? ORDER BY name', [organizationId(req)], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    return res.json({ success: true, data: rows });
  });
};

export const getAuditLogs = (req, res) => {
  const { role, id: employeeId, department, team } = req.user;
  let sql = `SELECT a.* FROM audit_logs a LEFT JOIN employees e ON e.id = a.employeeId AND e.organizationId = a.organizationId WHERE a.organizationId = ?`;
  const params = [organizationId(req)];
  if (role === 'EMPLOYEE') { sql += ' AND a.employeeId = ?'; params.push(employeeId); }
  else if (role === 'TEAM_LEAD') { sql += ' AND e.team = ?'; params.push(team); }
  else if (role === 'MANAGER') { sql += ' AND e.department = ?'; params.push(department); }
  sql += ' ORDER BY a.timestamp DESC LIMIT 250';
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    return res.json({ success: true, data: rows });
  });
};

export { OFFICE_COORDS, ALLOWED_RADIUS_METERS, getDistance };
