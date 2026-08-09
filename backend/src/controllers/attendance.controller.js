import db, { logAudit } from '../config/db.js';
import * as notificationService from '../services/notification.service.js';

// MAHE Bangalore Geofence Configuration
const OFFICE_COORDS = { lat: 12.9716, lng: 77.5946 };
const ALLOWED_RADIUS_METERS = 100;

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export const checkIn = (req, res) => {
  const { employeeId, employeeName, department, shiftType, workMode, latitude, longitude, accuracy, idempotencyKey } = req.body;

  // Server-side Geofencing validation
  if (workMode === 'Office') {
    if (latitude === undefined || longitude === undefined) {
      logAudit(employeeId, 'AUTHORIZATION_FAILURE', 'Office check-in rejected: missing coordinates');
      notificationService.triggerAlarm(employeeId, employeeName, 'GEOFENCE_VIOLATION', 'Office check-in attempted without location coordinates.');
      return res.status(400).json({ success: false, message: 'Location coordinates required for Office check-in.' });
    }
    const distance = getDistance(latitude, longitude, OFFICE_COORDS.lat, OFFICE_COORDS.lng);
    if (distance > ALLOWED_RADIUS_METERS) {
      logAudit(employeeId, 'AUTHORIZATION_FAILURE', `Office check-in rejected: geofence breach (${Math.round(distance)}m away)`);
      notificationService.triggerAlarm(employeeId, employeeName, 'GEOFENCE_VIOLATION', `Office check-in rejected: geofence breach (${Math.round(distance)}m away)`);
      return res.status(400).json({ success: false, message: `Geofencing validation failed. You are outside the office boundary (${Math.round(distance)}m away).` });
    }
  }

  const proceedToCheckIn = () => {
    // Active check-in session check (duplicate prevention)
    db.get("SELECT * FROM attendance_records WHERE employeeId = ? AND status != 'Checked Out'", [employeeId], (err, activeSession) => {
      if (activeSession) {
        notificationService.triggerAlarm(employeeId, employeeName, 'DUPLICATE_CHECKIN_ATTEMPT', 'Attempted check-in with an active session');
        return res.status(400).json({ success: false, message: 'Active session already exists. Must check out first.' });
      }

      const id = Math.random().toString(36).substr(2, 9);
      const date = new Date().toISOString().split('T')[0];
      const checkInTime = new Date().toISOString();

      db.run(
        "INSERT INTO attendance_records VALUES (?, ?, ?, ?, ?, ?, NULL, '[]', ?, ?, 'Checked In', ?, ?, ?, ?)",
        [id, employeeId, employeeName, department, date, checkInTime, shiftType, workMode, latitude, longitude, accuracy, idempotencyKey],
        (err2) => {
          if (err2) return res.status(500).json({ success: false, message: err2.message });
          
          logAudit(employeeId, 'CHECK_IN', `Checked in using ${workMode} mode on ${shiftType} shift`);
          notificationService.triggerGoogleCalendarNotification(employeeId, employeeName, 'Office Login Check-In', date);
          
          return res.json({
            success: true,
            data: { id, employeeId, employeeName, department, date, checkInTime, status: 'Checked In', breaks: [] }
          });
        }
      );
    });
  };

  // Idempotency check
  if (idempotencyKey) {
    db.get("SELECT * FROM attendance_records WHERE idempotencyKey = ?", [idempotencyKey], (err, row) => {
      if (row) return res.json({ success: true, data: { ...row, breaks: JSON.parse(row.breaks || '[]') } });
      proceedToCheckIn();
    });
  } else {
    proceedToCheckIn();
  }
};

export const takeBreak = (req, res) => {
  const { employeeId } = req.body;

  db.get("SELECT * FROM attendance_records WHERE employeeId = ? AND status != 'Checked Out'", [employeeId], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(400).json({ success: false, message: 'No active check-in session found.' });
    if (row.status === 'On Break') return res.status(400).json({ success: false, message: 'Already on break.' });

    const breaks = JSON.parse(row.breaks || '[]');
    breaks.push({ start: new Date().toISOString(), end: null });

    db.run(
      "UPDATE attendance_records SET status = 'On Break', breaks = ? WHERE id = ?",
      [JSON.stringify(breaks), row.id],
      (err2) => {
        if (err2) return res.status(500).json({ success: false, message: err2.message });
        logAudit(employeeId, 'BREAK_START', 'Started break');
        return res.json({ success: true, message: 'On Break' });
      }
    );
  });
};

export const resumeWork = (req, res) => {
  const { employeeId } = req.body;

  db.get("SELECT * FROM attendance_records WHERE employeeId = ? AND status = 'On Break'", [employeeId], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(400).json({ success: false, message: 'Employee is not on an active break.' });

    const breaks = JSON.parse(row.breaks || '[]');
    const activeBreakIndex = breaks.findIndex(b => b.end === null);
    if (activeBreakIndex !== -1) {
      breaks[activeBreakIndex].end = new Date().toISOString();
    }

    db.run(
      "UPDATE attendance_records SET status = 'Working', breaks = ? WHERE id = ?",
      [JSON.stringify(breaks), row.id],
      (err2) => {
        if (err2) return res.status(500).json({ success: false, message: err2.message });
        logAudit(employeeId, 'BREAK_END', 'Resumed work');
        return res.json({ success: true, message: 'Resumed Work' });
      }
    );
  });
};

export const checkOut = (req, res) => {
  const { employeeId } = req.body;

  db.get("SELECT * FROM attendance_records WHERE employeeId = ? AND status != 'Checked Out'", [employeeId], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(400).json({ success: false, message: 'Check-out-before-check-in rejection. No active session found.' });

    const breaks = JSON.parse(row.breaks || '[]');
    if (row.status === 'On Break') {
      const activeBreakIndex = breaks.findIndex(b => b.end === null);
      if (activeBreakIndex !== -1) {
        breaks[activeBreakIndex].end = new Date().toISOString();
      }
    }

    const checkOutTime = new Date().toISOString();

    db.run(
      "UPDATE attendance_records SET status = 'Checked Out', checkOutTime = ?, breaks = ? WHERE id = ?",
      [checkOutTime, JSON.stringify(breaks), row.id],
      (err2) => {
        if (err2) return res.status(500).json({ success: false, message: err2.message });
        logAudit(employeeId, 'CHECK_OUT', 'Checked out from active session');
        return res.json({ success: true, message: 'Checked Out' });
      }
    );
  });
};

export const getRecords = (req, res) => {
  const { role, id: employeeId, department } = req.user;

  if (role === 'ADMIN' || role === 'HR') {
    db.all("SELECT * FROM attendance_records", [], (err, rows) => {
      if (err) {
        console.error("getRecords DB Error:", err);
        return res.status(500).json({ success: false, message: err.message });
      }
      try {
        return res.json({ success: true, data: rows.map(r => ({ ...r, breaks: JSON.parse(r.breaks || '[]') })) });
      } catch (e) {
        console.error("getRecords Parse Error:", e, rows);
        return res.status(500).json({ success: false, message: e.message });
      }
    });
  } else if (role === 'MANAGER' || role === 'TEAM_LEAD') {
    db.all("SELECT * FROM attendance_records WHERE department = ?", [department], (err, rows) => {
      if (err) {
        console.error("getRecords DB Error:", err);
        return res.status(500).json({ success: false, message: err.message });
      }
      try {
        return res.json({ success: true, data: rows.map(r => ({ ...r, breaks: JSON.parse(r.breaks || '[]') })) });
      } catch (e) {
        console.error("getRecords Parse Error:", e, rows);
        return res.status(500).json({ success: false, message: e.message });
      }
    });
  } else {
    db.all("SELECT * FROM attendance_records WHERE employeeId = ?", [employeeId], (err, rows) => {
      if (err) {
        console.error("getRecords DB Error:", err);
        return res.status(500).json({ success: false, message: err.message });
      }
      try {
        return res.json({ success: true, data: rows.map(r => ({ ...r, breaks: JSON.parse(r.breaks || '[]') })) });
      } catch (e) {
        console.error("getRecords Parse Error:", e, rows);
        return res.status(500).json({ success: false, message: e.message });
      }
    });
  }
};

export const submitCorrection = (req, res) => {
  const { employeeId, employeeName, department, date, requestedCheckIn, requestedCheckOut, reason } = req.body;
  const id = Math.random().toString(36).substr(2, 9);
  const createdAt = new Date().toISOString();

  db.run(
    "INSERT INTO corrections VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NULL, NULL, ?)",
    [id, employeeId, employeeName, department, date, requestedCheckIn, requestedCheckOut, reason, createdAt],
    (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      logAudit(employeeId, 'CORRECTION_REQUESTED', `Submitted correction request for ${date}`);
      return res.json({ success: true, data: { id, status: 'Pending' } });
    }
  );
};

export const reviewCorrection = (req, res) => {
  const { id } = req.params;
  const { status, managerComment } = req.body;
  const reviewerName = req.user.name;

  db.get("SELECT * FROM corrections WHERE id = ?", [id], (err, correction) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!correction) return res.status(404).json({ success: false, message: 'Correction request not found' });

    db.run(
      "UPDATE corrections SET status = ?, managerComment = ?, reviewedBy = ? WHERE id = ?",
      [status, managerComment, reviewerName, id],
      (err2) => {
        if (err2) return res.status(500).json({ success: false, message: err2.message });

        if (status === 'Approved') {
          const dateStr = correction.date;
          const checkInTime = new Date(`${dateStr}T${correction.requestedCheckIn}`).toISOString();
          const checkOutTime = new Date(`${dateStr}T${correction.requestedCheckOut}`).toISOString();

          db.get("SELECT * FROM attendance_records WHERE employeeId = ? AND date = ?", [correction.employeeId, dateStr], (err3, record) => {
            if (record) {
              db.run(
                "UPDATE attendance_records SET checkInTime = ?, checkOutTime = ?, status = 'Checked Out' WHERE id = ?",
                [checkInTime, checkOutTime, record.id]
              );
            } else {
              const recordId = Math.random().toString(36).substr(2, 9);
              db.run(
                "INSERT INTO attendance_records VALUES (?, ?, ?, ?, ?, ?, ?, '[]', 'Regular', 'Office', 'Checked Out', NULL, NULL, NULL, NULL)",
                [recordId, correction.employeeId, correction.employeeName, correction.department, dateStr, checkInTime, checkOutTime]
              );
            }
          });
        }
        
        logAudit(correction.employeeId, `CORRECTION_${status.toUpperCase()}`, `Manager ${reviewerName} reviewed correction request: ${status}`);
        
        return res.json({ success: true, message: `Request successfully ${status}` });
      }
    );
  });
};

export const getCorrections = (req, res) => {
  const { role, id: employeeId, department } = req.user;

  if (role === 'ADMIN' || role === 'HR' || role === 'HR_MANAGER') {
    db.all("SELECT * FROM corrections", [], (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.json({ success: true, data: rows });
    });
  } else if (role === 'MANAGER' || role === 'TEAM_MANAGER' || role === 'TEAM_LEAD') {
    db.all("SELECT * FROM corrections WHERE department = ?", [department], (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.json({ success: true, data: rows });
    });
  } else {
    db.all("SELECT * FROM corrections WHERE employeeId = ?", [employeeId], (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.json({ success: true, data: rows });
    });
  }
};
