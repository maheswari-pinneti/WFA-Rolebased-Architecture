import jwt from 'jsonwebtoken';
import db, { logAudit } from '../config/db.js';
import * as mfaService from '../services/mfa.service.js';

const JWT_SECRET = 'wfa_platform_secret_jwt_key_2026';

export const login = (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  if (!email.endsWith('@thestackly.com') && !email.endsWith('@company.com')) {
    logAudit('anonymous', 'FAILED_AUTHENTICATION', `Login domain rejected for ${email}`);
    return res.status(403).json({ success: false, message: 'Domain access denied. Only corporate email domains permitted.' });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
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
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department, permissions: JSON.parse(user.permissions) },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    logAudit(user.id, 'LOGIN', `Logged in without MFA successfully`);

    return res.json({
      success: true,
      data: {
        token,
        user: {
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
          permissions: JSON.parse(user.permissions)
        }
      }
    });
  });
};

export const verifyMfa = async (req, res) => {
  const { tempToken, code } = req.body;
  if (!tempToken || !code) {
    return res.status(400).json({ success: false, message: 'Temporary token and MFA OTP code are required' });
  }

  try {
    const decoded = jwt.verify(tempToken, JWT_SECRET);
    
    // Call the pluggable persistent verification service
    const verifyResult = await mfaService.verifyOtp(decoded.email, code);
    if (!verifyResult.success) {
      logAudit('anonymous', 'FAILED_MFA_VERIFICATION', `Failed MFA verification for ${decoded.email}: ${verifyResult.message}`);
      return res.status(400).json({ success: false, message: verifyResult.message });
    }

    // Success, load full user
    db.get("SELECT * FROM users WHERE email = ?", [decoded.email], (err, user) => {
      if (err || !user) return res.status(404).json({ success: false, message: 'User not found' });

      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department, permissions: JSON.parse(user.permissions) },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      logAudit(user.id, 'MFA_VERIFICATION', `Successfully authenticated user ${decoded.email} via MFA OTP`);

      return res.json({
        success: true,
        data: {
          token,
          user: {
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
            permissions: JSON.parse(user.permissions)
          }
        }
      });
    });
  } catch (err) {
    return res.status(403).json({ success: false, message: 'MFA session expired or invalid' });
  }
};
