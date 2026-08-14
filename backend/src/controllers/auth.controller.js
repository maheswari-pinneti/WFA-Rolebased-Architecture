import jwt from 'jsonwebtoken';
import db from '../database/connection.js';
import { logAudit } from '../config/db.js';
import * as mfaService from '../services/mfa.service.js';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import * as sessionService from '../services/session.service.js';

const JWT_SECRET = env.JWT_SECRET;
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

export const login = (req, res) => {
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

  // Keep the older demo-domain aliases usable while persisting one canonical identity.
  const lookupEmail = email.endsWith('@company.com')
    ? email.replace('@company.com', '@thestackly.com')
    : email;

  db.get("SELECT * FROM users WHERE email = ?", [lookupEmail], async (err, user) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (!user) {
      logAudit('anonymous', 'FAILED_AUTHENTICATION', `User not found: ${email}`);
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    // Enforce BCrypt password hash check
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      logAudit(user.id, 'FAILED_AUTHENTICATION', `Incorrect password for ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // MFA Challenge if enabled
    if (user.mfa_enabled) {
      try {
        const mfaRes = await mfaService.generateAndSendOtp(user);
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

    // Direct Login if MFA not enabled: create a real session
    try {
      const session = await sessionService.createSession(user, req.ip, req.headers['user-agent']);
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
  });
};

/**
 * POST /api/auth/verify-mfa
 * Verify temporary token against OTP code.
 */
export const verifyMfa = async (req, res) => {
  const challengeId = req.body.challengeId || req.body.tempToken;
  const code = req.body.otp || req.body.code;

  if (!challengeId || !code) {
    return res.status(400).json({ success: false, message: 'Challenge ID and MFA OTP code are required' });
  }

  try {
    // Call persistent OTP verification service
    const verifyResult = await mfaService.verifyOtp(challengeId, code);
    if (!verifyResult.success) {
      logAudit('anonymous', 'FAILED_MFA_VERIFICATION', `Failed MFA verification for challenge ${challengeId}: ${verifyResult.message}`);
      return res.status(400).json({ success: false, message: verifyResult.message });
    }

    // Success, load full user profile
    db.get("SELECT * FROM users WHERE id = ?", [verifyResult.userId], async (err, user) => {
      if (err || !user) return res.status(404).json({ success: false, message: 'User not found' });

      try {
        const session = await sessionService.createSession(user, req.ip, req.headers['user-agent']);
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
    });
  } catch (err) {
    console.error("MFA VERIFICATION ERROR:", err);
    return res.status(403).json({ success: false, message: 'MFA session expired or invalid' });
  }
};

/**
 * POST /api/auth/logout
 * Terminates session. Revokes session and associated refresh tokens.
 */
export const logout = async (req, res) => {
  const refreshToken = req.body?.refreshToken || req.headers['x-refresh-token'];
  if (refreshToken) {
    try {
      await sessionService.revokeRefreshToken(refreshToken);
    } catch (err) {
      console.error('Error during token revocation:', err);
    }
  }

  if (req.user) {
    logAudit(req.user.id, 'LOGOUT', `User ${req.user.email} initiated logout`);
  }
  return res.json({ success: true, message: 'Logout successful' });
};

/**
 * GET /api/auth/me
 * Retrieves current authenticated user profile matching the verified token.
 */
export const getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized: User context missing' });
  }
  return res.json({
    success: true,
    data: toUser(req.user)
  });
};

/**
 * POST /api/auth/refresh
 * Renews the access token using a valid refresh token.
 */
export const refresh = async (req, res) => {
  const refreshToken = req.body?.refreshToken || req.headers['x-refresh-token'];
  if (!refreshToken) {
    return res.status(400).json({ success: false, message: 'Refresh token is required' });
  }

  try {
    const rotated = await sessionService.rotateRefreshToken(refreshToken, req.ip, req.headers['user-agent']);
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
    const resendResult = await mfaService.resendOtp(challengeId);
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

export const healthCheck = (req, res) => {
  return res.json({
    success: true,
    service: "wfa-backend",
    status: "healthy"
  });
};

