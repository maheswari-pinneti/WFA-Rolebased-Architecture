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
});
