process.env.DB_NAME = 'wfa-test-e2e.db';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import axios from 'axios';
import { app } from '../../server.js';
import db, { initDb } from '../../db.js';

let server: any;
const PORT = 5098;
const client = axios.create({
  baseURL: `http://localhost:${PORT}`,
  validateStatus: () => true
});

beforeAll(async () => {
  await initDb();
  await new Promise((resolve) => {
    db.run("DELETE FROM attendance_records", () => {
      db.run("DELETE FROM corrections", () => {
        resolve();
      });
    });
  });
  return new Promise((resolve) => {
    server = app.listen(PORT, () => {
      resolve();
    });
  });
});

afterAll(async () => {
  return new Promise((resolve) => {
    server.close(() => {
      resolve();
    });
  });
});

describe('E2E User Flow Tests', () => {
  let token = '';
  const employeeInfo = {
    employeeId: 'usr-emp-01',
    employeeName: 'Alex Mercer',
    department: 'Engineering',
    shiftType: 'Regular',
    workMode: 'Remote',
    idempotencyKey: `e2e-idemp-${Date.now()}`
  };

  it('Flow: Login -> Check-In -> Break -> Resume -> Check-Out -> View History', async () => {
    // 1. Login
    const loginRes = await client.post('/v1/auth/login', { email: 'employee@thestackly.com' });
    expect(loginRes.status).toBe(200);
    // Since MFA is enabled, we get tempToken and code
    expect(loginRes.data.data.requiresMfa).toBe(true);
    const { tempToken, otpDevHint } = loginRes.data.data;

    // MFA Verify
    const verifyRes = await client.post('/v1/auth/mfa-verify', { tempToken, code: otpDevHint });
    expect(verifyRes.status).toBe(200);
    token = verifyRes.data.data.token;
    expect(token).toBeDefined();

    // 2. Check-In
    const checkInRes = await client.post('/v1/attendance/check-in', employeeInfo, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(checkInRes.status).toBe(200);
    expect(checkInRes.data.data.status).toBe('Checked In');

    // 3. Take Break
    const breakRes = await client.post('/v1/attendance/break', { employeeId: 'usr-emp-01' }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(breakRes.status).toBe(200);

    // 4. Resume
    const resumeRes = await client.post('/v1/attendance/resume', { employeeId: 'usr-emp-01' }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(resumeRes.status).toBe(200);

    // 5. Check-Out
    const checkOutRes = await client.post('/v1/attendance/check-out', { employeeId: 'usr-emp-01' }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(checkOutRes.status).toBe(200);

    // 6. View History
    const historyRes = await client.get('/v1/attendance/records', {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(historyRes.status).toBe(200);
    expect(historyRes.data.data.length).toBeGreaterThan(0);
    const selfRecord = historyRes.data.data.find((r: any) => r.employeeId === 'usr-emp-01');
    expect(selfRecord).toBeDefined();
    expect(selfRecord.status).toBe('Checked Out');
  });

  it('should enforce geofence, duplicate check-in, and double-checkout restrictions', async () => {
    // 1. Login to get token
    const loginRes = await client.post('/v1/auth/login', { email: 'employee@thestackly.com' });
    const { tempToken, otpDevHint } = loginRes.data.data;
    const verifyRes = await client.post('/v1/auth/mfa-verify', { tempToken, code: otpDevHint });
    const empToken = verifyRes.data.data.token;

    // 2. Try check-in with out-of-bounds geofence
    const badGeofenceInfo = {
      employeeId: 'usr-emp-01',
      employeeName: 'Alex Mercer',
      department: 'Engineering',
      shiftType: 'Regular',
      workMode: 'Office',
      latitude: 0,
      longitude: 0,
      accuracy: 10,
      idempotencyKey: `e2e-badgeo-${Date.now()}`
    };
    const badGeoRes = await client.post('/v1/attendance/check-in', badGeofenceInfo, {
      headers: { Authorization: `Bearer ${empToken}` }
    });
    expect(badGeoRes.status).toBe(400);
    expect(badGeoRes.data.message).toContain('Geofencing validation failed');

    // 3. Perform a valid check-in
    const validInfo = {
      employeeId: 'usr-emp-01',
      employeeName: 'Alex Mercer',
      department: 'Engineering',
      shiftType: 'Regular',
      workMode: 'Remote',
      idempotencyKey: `e2e-valid-${Date.now()}`
    };
    const goodCheckInRes = await client.post('/v1/attendance/check-in', validInfo, {
      headers: { Authorization: `Bearer ${empToken}` }
    });
    expect(goodCheckInRes.status).toBe(200);

    // 4. Try duplicate check-in (should reject with 400)
    const duplicateCheckInRes = await client.post('/v1/attendance/check-in', {
      ...validInfo,
      idempotencyKey: `e2e-dup-${Date.now()}`
    }, {
      headers: { Authorization: `Bearer ${empToken}` }
    });
    expect(duplicateCheckInRes.status).toBe(400);
    expect(duplicateCheckInRes.data.message).toContain('Active session already exists');

    // 5. Perform valid check-out
    const checkOutRes1 = await client.post('/v1/attendance/check-out', { employeeId: 'usr-emp-01' }, {
      headers: { Authorization: `Bearer ${empToken}` }
    });
    expect(checkOutRes1.status).toBe(200);

    // 6. Try duplicate check-out (should reject with 400 because there is no active session)
    const checkOutRes2 = await client.post('/v1/attendance/check-out', { employeeId: 'usr-emp-01' }, {
      headers: { Authorization: `Bearer ${empToken}` }
    });
    expect(checkOutRes2.status).toBe(400);
    expect(checkOutRes2.data.message).toContain('No active session found');
  });
});
