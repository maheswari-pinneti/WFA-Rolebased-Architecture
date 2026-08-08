process.env.DB_NAME = 'wfa-test-api.db';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import axios from 'axios';
import { app } from '../../server.js';
import db, { initDb } from '../../db.js';

let server: any;
const PORT = 5099;
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

describe('Workforce Analytics API Integration & Authorization Tests', () => {
  let adminToken = '';
  let employeeToken = '';

  it('should fail login with invalid domain', async () => {
    const res = await client.post('/v1/auth/login', { email: 'bad@gmail.com' });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('should authenticate admin successfully', async () => {
    const res = await client.post('/v1/auth/login', { email: 'admin@thestackly.com' });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data.requiresMfa).toBe(true);
    
    // MFA Verification step
    const mfaRes = await client.post('/v1/auth/mfa-verify', {
      tempToken: res.data.data.tempToken,
      code: res.data.data.otpDevHint
    });
    expect(mfaRes.status).toBe(200);
    expect(mfaRes.data.data.token).toBeDefined();
    adminToken = mfaRes.data.data.token;
  });

  it('should authenticate employee successfully', async () => {
    const res = await client.post('/v1/auth/login', { email: 'employee@thestackly.com' });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data.requiresMfa).toBe(true);

    // MFA Verification step
    const mfaRes = await client.post('/v1/auth/mfa-verify', {
      tempToken: res.data.data.tempToken,
      code: res.data.data.otpDevHint
    });
    expect(mfaRes.status).toBe(200);
    employeeToken = mfaRes.data.data.token;
  });

  it('should fetch analytics with valid token', async () => {
    const res = await client.get('/v1/analytics', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data.metrics).toBeDefined();
  });

  it('should reject analytics fetch without token', async () => {
    const res = await client.get('/v1/analytics');
    expect(res.status).toBe(401);
  });

  it('should reject user list for non-admin employee', async () => {
    const res = await client.get('/v1/users', {
      headers: { Authorization: `Bearer ${employeeToken}` }
    });
    expect(res.status).toBe(403);
  });

  it('should fetch users list for admin', async () => {
    const res = await client.get('/v1/users', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data.length).toBeGreaterThan(0);
  });
});
