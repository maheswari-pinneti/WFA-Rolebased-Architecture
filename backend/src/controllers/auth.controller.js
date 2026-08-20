import mongoose from 'mongoose';
import { logAudit } from '../config/db.js';
import * as authService from '../services/auth.service.js';
import { userRepository } from '../repositories/user.repository.js';
import bcrypt from 'bcryptjs';
import { Employee } from '../models/Employee.js';
import crypto from 'crypto';

const ORGANIZATION_ID = 'org-stackly';

const toUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department,
  team: user.team,
  location: user.location,
  title: user.title,
  clearanceLevel: user.clearanceLevel,
  status: user.status,
  organizationId: user.organizationId || ORGANIZATION_ID,
  permissions: typeof user.permissions === 'string' ? JSON.parse(user.permissions || '[]') : user.permissions
});

const maxConcurrentHashes = 4;
let activeHashes = 0;
const hashQueue = [];

const queueBcryptCompare = (password, hash) => {
  return new Promise((resolve, reject) => {
    const runCompare = async () => {
      activeHashes++;
      try {
        const match = await bcrypt.compare(password, hash);
        resolve(match);
      } catch (err) {
        reject(err);
      } finally {
        activeHashes--;
        if (hashQueue.length > 0) {
          const next = hashQueue.shift();
          next();
        }
      }
    };

    if (activeHashes < maxConcurrentHashes) {
      runCompare();
    } else {
      hashQueue.push(runCompare);
    }
  });
};

export const login = async (req, res) => {
  try {
    const rawEmail = req.body?.email;
    const password = req.body?.password;
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }

    if (!email.endsWith('@thestackly.com') && !email.endsWith('@company.com')) {
      logAudit('anonymous', 'FAILED_AUTHENTICATION', `Login domain rejected for ${email}`);
      return res.status(403).json({ success: false, message: 'Domain access denied. Only corporate email domains permitted.' });
    }

    const lookupEmail = email.endsWith('@company.com')
      ? email.replace('@company.com', '@thestackly.com')
      : email;

    const user = await userRepository.findByEmail(lookupEmail);
    if (!user) {
      logAudit('anonymous', 'FAILED_AUTHENTICATION', `User not found: ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    try {
      const isMatch = await queueBcryptCompare(password, user.password_hash);
      if (!isMatch) {
        logAudit(user.id, 'FAILED_AUTHENTICATION', `Incorrect password for ${email}`);
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } catch (compareErr) {
      return res.status(500).json({ success: false, message: 'Encryption verification failed' });
    }

    if (user.mfa_enabled) {
      try {
        const mfaRes = await authService.generateAndSendOtp(user);
        logAudit(user.id, 'MFA_CHALLENGE', `OTP challenge generated for ${email}`);

        return res.json({
          success: true,
          data: {
            requiresMfa: true,
            challengeId: mfaRes.challengeId,
            expiresAt: mfaRes.expiresAt,
            otpSent: true,
            otpDevHint: mfaRes.otpDevHint
          }
        });
      } catch (mfaErr) {
        return res.status(500).json({ success: false, message: mfaErr.message });
      }
    }

    try {
      const session = await authService.createSession(user, req.ip, req.headers['user-agent']);
      logAudit(user.id, 'LOGIN', `Logged in without MFA successfully`);

      return res.json({
        success: true,
        data: {
          token: session.accessToken,
          refreshToken: session.refreshToken,
          user: toUser(user)
        }
      });
    } catch (sessionErr) {
      return res.status(500).json({ success: false, message: sessionErr.message });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyMfa = async (req, res) => {
  const challengeId = req.body.challengeId || req.body.tempToken;
  const code = req.body.otp || req.body.code;

  if (!challengeId || !code) {
    return res.status(400).json({ success: false, message: 'Challenge ID and MFA OTP code are required' });
  }

  try {
    const verifyResult = await authService.verifyOtp(challengeId, code);
    if (!verifyResult.success) {
      logAudit('anonymous', 'FAILED_MFA_VERIFICATION', `Failed MFA verification for challenge ${challengeId}: ${verifyResult.message}`);
      return res.status(400).json({ success: false, message: verifyResult.message });
    }

    const user = await userRepository.findById(verifyResult.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    try {
      const session = await authService.createSession(user, req.ip, req.headers['user-agent']);
      logAudit(user.id, 'MFA_VERIFICATION', `Successfully authenticated user ${user.email} via MFA OTP`);

      return res.json({
        success: true,
        data: {
          token: session.accessToken,
          refreshToken: session.refreshToken,
          user: toUser(user)
        }
      });
    } catch (sessionErr) {
      return res.status(500).json({ success: false, message: sessionErr.message });
    }
  } catch (err) {
    console.error("MFA VERIFICATION ERROR:", err);
    return res.status(403).json({ success: false, message: 'MFA session expired or invalid' });
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.body?.refreshToken || req.headers['x-refresh-token'];
  if (refreshToken) {
    try {
      await authService.revokeRefreshToken(refreshToken);
    } catch (err) {
      console.error('Error during token revocation:', err);
    }
  }

  if (req.user) {
    logAudit(req.user.id, 'LOGOUT', `User ${req.user.email} initiated logout`);
  }
  return res.json({ success: true, message: 'Logout successful' });
};

export const getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized: User context missing' });
  }
  return res.json({
    success: true,
    data: toUser(req.user)
  });
};

export const refresh = async (req, res) => {
  const refreshToken = req.body?.refreshToken || req.headers['x-refresh-token'];
  if (!refreshToken) {
    return res.status(400).json({ success: false, message: 'Refresh token is required' });
  }

  try {
    const rotated = await authService.rotateRefreshToken(refreshToken, req.ip, req.headers['user-agent']);
    return res.json({
      success: true,
      data: {
        token: rotated.accessToken,
        refreshToken: rotated.refreshToken
      }
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: err.message || 'Invalid or expired refresh token' });
  }
};

export const resendMfa = async (req, res) => {
  const challengeId = req.body.challengeId || req.body.tempToken;
  if (!challengeId) {
    return res.status(400).json({ success: false, message: 'Challenge ID is required.' });
  }

  try {
    const resendResult = await authService.resendOtp(challengeId);
    if (!resendResult.success) {
      return res.status(400).json({ success: false, message: resendResult.message });
    }

    logAudit('anonymous', 'OTP_RESEND', `OTP challenge resent for session ${challengeId}`);

    return res.json({
      success: true,
      data: {
        challengeId: resendResult.challengeId,
        expiresAt: resendResult.expiresAt,
        otpSent: true,
        otpDevHint: resendResult.otpDevHint
      }
    });
  } catch (err) {
    console.error("MFA RESEND ERROR:", err);
    return res.status(500).json({ success: false, message: 'Failed to resend OTP.' });
  }
};

export const healthCheck = async (req, res) => {
  try {
    let dbStatus = "disconnected";
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping();
      dbStatus = "connected";
    }
    return res.json({
      success: true,
      status: "healthy",
      api: "healthy",
      database: dbStatus,
      databaseType: "MongoDB Atlas",
      environment: process.env.NODE_ENV || "development"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      status: "healthy",
      api: "healthy",
      database: "error",
      databaseType: "MongoDB Atlas",
      environment: process.env.NODE_ENV || "development"
    });
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, department, role, location, designation } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail.endsWith('@thestackly.com') && !trimmedEmail.endsWith('@company.com')) {
      return res.status(403).json({ success: false, message: 'Only official @thestackly.com or @company.com corporate email domains permitted.' });
    }

    const lookupEmail = trimmedEmail.endsWith('@company.com')
      ? trimmedEmail.replace('@company.com', '@thestackly.com')
      : trimmedEmail;

    const existingUser = await userRepository.findByEmail(lookupEmail);
    if (existingUser) {
      logAudit('anonymous', 'SIGNUP_DUPLICATE', `Duplicate registration attempt for existing email: ${lookupEmail}`);
      return res.status(201).json({
        success: true,
        message: 'Account registered successfully.'
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const uuid = crypto.randomUUID();
    const employeeId = `emp-${uuid.substring(0, 8)}`;
    const randomYear = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const employeeCode = `STK-${randomYear}-${randomNum}`;

    const newRole = role || 'EMPLOYEE';
    const newDept = department || 'Engineering';
    const newLoc = location || 'Hyderabad';
    const newDesign = designation || 'Associate';

    const permissions = ['PROFILE_VIEW', 'PROFILE_UPDATE', 'ATTENDANCE_VIEW_SELF', 'LEAVE_REQUEST', 'PERFORMANCE_VIEW_SELF', 'GOAL_UPDATE', 'DOCUMENT_UPLOAD'];
    if (newRole === 'MANAGER') {
      permissions.push('TEAM_VIEW', 'TEAM_ANALYTICS_VIEW', 'EMPLOYEE_VIEW_TEAM', 'ATTENDANCE_VIEW_TEAM', 'LEAVE_APPROVE', 'PERFORMANCE_REVIEW', 'TASK_ASSIGN', 'REPORT_VIEW_TEAM');
    }

    await userRepository.create({
      id: employeeId,
      name,
      email: lookupEmail,
      password_hash: passwordHash,
      role: newRole,
      department: newDept,
      location: newLoc,
      title: newDesign,
      clearanceLevel: newRole === 'MANAGER' ? 3 : 1,
      status: 'ACTIVE',
      permissions,
      mfa_enabled: 1,
      organizationId: ORGANIZATION_ID
    });

    await Employee.create({
      id: employeeId,
      employeeCode,
      name,
      email: lookupEmail,
      role: newRole,
      department: newDept,
      designation: newDesign,
      status: 'ACTIVE',
      joinDate: new Date().toISOString().substring(0, 10),
      performanceScore: 90,
      attendanceRate: 95,
      location: newLoc,
      organizationId: ORGANIZATION_ID,
      companyId: ORGANIZATION_ID
    });

    logAudit(employeeId, 'SIGNUP', `Registered new user account: ${lookupEmail}`);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.'
    });
  } catch (err) {
    console.error('Signup failed:', err);
    return res.status(500).json({ success: false, message: err.message || 'Signup failed' });
  }
};
