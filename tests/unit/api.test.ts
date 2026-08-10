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
  let managerToken = '';
  let teamLeadToken = '';

  const loginToken = async (email: string) => {
    const loginRes = await client.post('/v1/auth/login', { email });
    const verifyRes = await client.post('/v1/auth/mfa-verify', {
      tempToken: loginRes.data.data.tempToken,
      code: loginRes.data.data.otpDevHint
    });
    return verifyRes.data.data.token as string;
  };

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

  it('should authenticate department and team scopes', async () => {
    managerToken = await loginToken('manager@thestackly.com');
    teamLeadToken = await loginToken('lead@thestackly.com');
    expect(managerToken).toBeDefined();
    expect(teamLeadToken).toBeDefined();
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

  it('should restrict employees to self-level attendance records', async () => {
    const denied = await client.post('/v1/attendance/check-in', {
      employeeId: 'emp-2', employeeName: 'Other Employee', department: 'Product Management',
      shiftType: 'Regular', workMode: 'Remote', idempotencyKey: `scope-denied-${Date.now()}`
    }, { headers: { Authorization: `Bearer ${employeeToken}` } });
    expect(denied.status).toBe(403);

    const history = await client.get('/v1/attendance/records', {
      headers: { Authorization: `Bearer ${employeeToken}` }
    });
    expect(history.status).toBe(200);
    expect(history.data.data.every((record: any) => record.employeeId === 'usr-emp-01')).toBe(true);
  });

  it('should enforce department and team scopes server-side', async () => {
    const managerEmployees = await client.get('/v1/employees', { headers: { Authorization: `Bearer ${managerToken}` } });
    expect(managerEmployees.status).toBe(200);
    expect(managerEmployees.data.data.every((employee: any) => employee.department === 'Engineering')).toBe(true);

    const teamEmployees = await client.get('/v1/employees', { headers: { Authorization: `Bearer ${teamLeadToken}` } });
    expect(teamEmployees.status).toBe(200);
    expect(teamEmployees.data.data.every((employee: any) => employee.team === 'Frontend Team')).toBe(true);

    const crossDepartment = await client.get('/v1/attendance/records?employeeId=emp-2', {
      headers: { Authorization: `Bearer ${managerToken}` }
    });
    expect(crossDepartment.status).toBe(403);
  });

  it('should persist and scope leave requests and tasks', async () => {
    const leave = await client.post('/v1/leave-requests', {
      type: 'Annual Leave', startDate: '2026-09-10', endDate: '2026-09-12', reason: 'Integration test request'
    }, { headers: { Authorization: `Bearer ${employeeToken}` } });
    expect(leave.status).toBe(201);
    expect(leave.data.data.status).toBe('PENDING');

    const ownRequests = await client.get('/v1/leave-requests', {
      headers: { Authorization: `Bearer ${employeeToken}` }
    });
    expect(ownRequests.status).toBe(200);
    expect(ownRequests.data.data.some((request: any) => request.id === leave.data.data.id)).toBe(true);

    const managerRequests = await client.get('/v1/leave-requests', {
      headers: { Authorization: `Bearer ${managerToken}` }
    });
    expect(managerRequests.status).toBe(200);
    expect(managerRequests.data.data.every((request: any) => request.department === 'Engineering')).toBe(true);

    const reviewed = await client.put(`/v1/leave-requests/${leave.data.data.id}`, {
      status: 'APPROVED', reviewComment: 'Approved by integration test'
    }, { headers: { Authorization: `Bearer ${managerToken}` } });
    expect(reviewed.status).toBe(200);
    expect(reviewed.data.data.status).toBe('APPROVED');

    const managerTasks = await client.get('/v1/tasks', {
      headers: { Authorization: `Bearer ${managerToken}` }
    });
    expect(managerTasks.status).toBe(200);
    expect(managerTasks.data.data.every((task: any) => task.department === 'Engineering')).toBe(true);

    const teamTasks = await client.get('/v1/tasks', {
      headers: { Authorization: `Bearer ${teamLeadToken}` }
    });
    expect(teamTasks.status).toBe(200);
    expect(teamTasks.data.data.every((task: any) => task.team === 'Frontend Team')).toBe(true);
  });

  it('should reject cross-organization query attempts', async () => {
    const res = await client.get('/v1/analytics?organizationId=other-org', {
      headers: { Authorization: `Bearer ${employeeToken}` }
    });
    expect(res.status).toBe(403);
  });
});
