import jwt from 'jsonwebtoken';
import db, { logAudit } from '../config/db.js';
import * as mfaService from '../services/mfa.service.js';

const JWT_SECRET = 'wfa_platform_secret_jwt_key_2026';
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
  permissions: JSON.parse(user.permissions || '[]')
});

const signUser = (user) => jwt.sign(
  {
    ...toUser(user),
    requiresMfa: false
  },
  JWT_SECRET,
  { expiresIn: '24h' }
);

export const login = (req, res) => {
  const rawEmail = req.body?.email;
  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
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

    // MFA Challenge if enabled
    if (user.mfa_enabled) {
      try {
        const mfaRes = await mfaService.generateAndSendOtp(user.email);
        
        const tempToken = jwt.sign(
          { email: user.email, requiresMfa: true },
          JWT_SECRET,
          { expiresIn: '5m' }
        );

        logAudit(user.id, 'MFA_CHALLENGE', `OTP challenge generated for ${email}`);

        return res.json({
          success: true,
          data: {
            requiresMfa: true,
            tempToken,
            otpSent: true,
            otpDevHint: mfaRes.otpDevHint
          }
        });
      } catch (mfaErr) {
        return res.status(500).json({ success: false, message: mfaErr.message });
      }
    }

    // Direct Login if MFA not enabled
    const token = signUser(user);

    logAudit(user.id, 'LOGIN', `Logged in without MFA successfully`);

    return res.json({
      success: true,
      data: {
        token,
        user: toUser(user)
      }
    });
  });
};

/**
 * POST /api/auth/verify-mfa
 * Verify temporary token against OTP code.
 */
export const verifyMfa = async (req, res) => {
  const { tempToken, code } = req.body;
  if (!tempToken || !code) {
    return res.status(400).json({ success: false, message: 'Temporary token and MFA OTP code are required' });
  }

  try {
    const decoded = jwt.verify(tempToken, JWT_SECRET);
    
    // Call persistent OTP verification service
    const verifyResult = await mfaService.verifyOtp(decoded.email, code);
    if (!verifyResult.success) {
      logAudit('anonymous', 'FAILED_MFA_VERIFICATION', `Failed MFA verification for ${decoded.email}: ${verifyResult.message}`);
      return res.status(400).json({ success: false, message: verifyResult.message });
    }

    // Success, load full user profile
    db.get("SELECT * FROM users WHERE email = ?", [decoded.email], (err, user) => {
      if (err || !user) return res.status(404).json({ success: false, message: 'User not found' });

      const token = signUser(user);

      logAudit(user.id, 'MFA_VERIFICATION', `Successfully authenticated user ${decoded.email} via MFA OTP`);

      return res.json({
        success: true,
        data: {
          token,
          user: toUser(user)
        }
      });
    });
  } catch (err) {
    return res.status(403).json({ success: false, message: 'MFA session expired or invalid' });
  }
};

/**
 * POST /api/auth/logout
 * Terminates session. As JWT is stateless locally, we audit the logout action 
 * and let the client discard the token from local storage.
 */
export const logout = (req, res) => {
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
 * Renews the access token for active sessions to prevent timeout expiration.
 */
export const refresh = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Cannot refresh token without context' });
  }
  const newToken = signUser(req.user);
  return res.json({
    success: true,
    data: {
      token: newToken
    }
  });
};

