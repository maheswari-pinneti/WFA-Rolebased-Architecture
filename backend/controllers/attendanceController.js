import { db } from '../config/db.js';

export const getRecords = (req, res) => {
  let query = 'SELECT * FROM attendance_records';
  let params = [];

  if (req.user.role === 'EMPLOYEE') {
    query += ' WHERE employeeId = ?';
    params.push(req.user.id);
  } else if (req.user.role === 'MANAGER' || req.user.role === 'TEAM_LEAD') {
    query += ' WHERE department = ?';
    params.push(req.user.department);
  }

  db.all(query, params, (err, records) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (records.length === 0) return res.json({ success: true, data: [] });

    let completed = 0;
    records.forEach((rec) => {
      db.all('SELECT start, end FROM breaks WHERE recordId = ?', [rec.id], (bErr, breaks) => {
        rec.breaks = breaks || [];
        completed++;
        if (completed === records.length) {
          res.json({ success: true, data: records });
        }
      });
    });
  });
};

export const checkIn = (req, res) => {
  const { employeeId, employeeName, department, shiftType, workMode, latitude, longitude, accuracy, idempotencyKey } = req.body;

  if (idempotencyKey) {
    db.get('SELECT * FROM attendance_records WHERE idempotencyKey = ?', [idempotencyKey], (err, existing) => {
      if (existing) {
        return db.all('SELECT start, end FROM breaks WHERE recordId = ?', [existing.id], (bErr, breaks) => {
          existing.breaks = breaks || [];
          return res.json({ success: true, data: existing });
        });
      }
      proceedToCheckIn();
    });
  } else {
    proceedToCheckIn();
  }

  function proceedToCheckIn() {
    db.get("SELECT * FROM attendance_records WHERE employeeId = ? AND status != 'Checked Out'", [employeeId], (err, active) => {
      if (active) return res.status(400).json({ success: false, message: 'Active session already exists. Must check out first.' });

      const id = Math.random().toString(36).substr(2, 9);
      const serverTime = new Date().toISOString();
      const date = serverTime.split('T')[0];

      db.run(`
        INSERT INTO attendance_records (id, employeeId, employeeName, department, date, checkInTime, checkOutTime, status, shiftType, workMode, latitude, longitude, accuracy, idempotencyKey)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [id, employeeId, employeeName, department, date, serverTime, null, 'Checked In', shiftType, workMode, latitude, longitude, accuracy, idempotencyKey], function(insErr) {
        if (insErr) return res.status(500).json({ success: false, message: insErr.message });

        const auditId = Math.random().toString(36).substr(2, 9);
        db.run('INSERT INTO audit_logs (id, employeeId, action, details, timestamp) VALUES (?, ?, ?, ?, ?)',
          [auditId, employeeId, 'CHECK_IN', `Checked in using ${workMode} mode on ${shiftType} shift`, serverTime]);

        res.json({
          success: true,
          data: {
            id, employeeId, employeeName, department, date, checkInTime: serverTime, checkOutTime: null, breaks: [], status: 'Checked In', shiftType, workMode, latitude, longitude, accuracy, idempotencyKey
          }
        });
      });
    });
  }
};

export const takeBreak = (req, res) => {
  const { employeeId } = req.body;

  db.get("SELECT * FROM attendance_records WHERE employeeId = ? AND status != 'Checked Out'", [employeeId], (err, record) => {
    if (!record) return res.status(404).json({ success: false, message: 'No active check-in session found.' });
    if (record.status === 'On Break') return res.status(400).json({ success: false, message: 'Already on break.' });

    const breakId = Math.random().toString(36).substr(2, 9);
    const now = new Date().toISOString();

    db.serialize(() => {
      db.run('INSERT INTO breaks (id, recordId, start, end) VALUES (?, ?, ?, ?)', [breakId, record.id, now, null]);
      db.run("UPDATE attendance_records SET status = 'On Break' WHERE id = ?", [record.id]);
      
      db.run('INSERT INTO audit_logs (id, employeeId, action, details, timestamp) VALUES (?, ?, ?, ?, ?)',
        [Math.random().toString(36).substr(2, 9), employeeId, 'BREAK_START', 'Started break', now]);

      res.json({ success: true, message: 'Break started.' });
    });
  });
};

export const resumeWork = (req, res) => {
  const { employeeId } = req.body;

  db.get("SELECT * FROM attendance_records WHERE employeeId = ? AND status = 'On Break'", [employeeId], (err, record) => {
    if (!record) return res.status(404).json({ success: false, message: 'Employee is not on an active break.' });

    const now = new Date().toISOString();
    db.serialize(() => {
      db.run("UPDATE breaks SET end = ? WHERE recordId = ? AND end IS NULL", [now, record.id]);
      db.run("UPDATE attendance_records SET status = 'Working' WHERE id = ?", [record.id]);

      db.run('INSERT INTO audit_logs (id, employeeId, action, details, timestamp) VALUES (?, ?, ?, ?, ?)',
        [Math.random().toString(36).substr(2, 9), employeeId, 'BREAK_END', 'Resumed work', now]);

      res.json({ success: true, message: 'Work resumed.' });
    });
  });
};

export const checkOut = (req, res) => {
  const { employeeId } = req.body;

  db.get("SELECT * FROM attendance_records WHERE employeeId = ? AND status != 'Checked Out'", [employeeId], (err, record) => {
    if (!record) return res.status(404).json({ success: false, message: 'Check-out-before-check-in rejection. No active session found.' });

    const now = new Date().toISOString();
    db.serialize(() => {
      if (record.status === 'On Break') {
        db.run("UPDATE breaks SET end = ? WHERE recordId = ? AND end IS NULL", [now, record.id]);
      }
      db.run("UPDATE attendance_records SET status = 'Checked Out', checkOutTime = ? WHERE id = ?", [now, record.id]);

      db.run('INSERT INTO audit_logs (id, employeeId, action, details, timestamp) VALUES (?, ?, ?, ?, ?)',
        [Math.random().toString(36).substr(2, 9), employeeId, 'CHECK_OUT', 'Checked out from active session', now]);

      res.json({ success: true, message: 'Checked out successfully.' });
    });
  });
};

export const getCorrections = (req, res) => {
  let query = 'SELECT * FROM correction_requests';
  let params = [];

  if (req.user.role === 'EMPLOYEE') {
    query += ' WHERE employeeId = ?';
    params.push(req.user.id);
  } else if (req.user.role === 'MANAGER' || req.user.role === 'TEAM_LEAD') {
    query += ' WHERE department = ?';
    params.push(req.user.department);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: rows });
  });
};

export const submitCorrection = (req, res) => {
  const { employeeId, employeeName, department, date, requestedCheckIn, requestedCheckOut, reason } = req.body;
  const id = Math.random().toString(36).substr(2, 9);
  const now = new Date().toISOString();

  db.run(`
    INSERT INTO correction_requests (id, employeeId, employeeName, department, date, requestedCheckIn, requestedCheckOut, reason, status, managerComment, reviewedBy, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [id, employeeId, employeeName, department, date, requestedCheckIn, requestedCheckOut, reason, 'Pending', '', '', now], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: 'Correction request submitted.' });
  });
};

export const updateCorrectionStatus = (req, res) => {
  const { id } = req.params;
  const { status, managerComment } = req.body;

  db.run(`
    UPDATE correction_requests
    SET status = ?, managerComment = ?, reviewedBy = ?
    WHERE id = ?
  `, [status, managerComment, req.user.email, id], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: 'Correction request updated.' });
  });
};
