import bcrypt from 'bcryptjs';
import db from '../config/db.js';

const OTP_EXPIRY_MINUTES = 5;
const MAX_ATTEMPTS = 5;
const MAX_RESENDS = 5;

const generateId = () => {
  return Math.random().toString(36).slice(2, 11) + '-' + Math.random().toString(36).slice(2, 11);
};

export const generateAndSendOtp = async (user) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const salt = bcrypt.genSaltSync(10);
  const otpHash = bcrypt.hashSync(code, salt);
  
  const challengeId = generateId();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();
  const createdAt = new Date().toISOString();

  console.log(`[MFA DELIVERY] Simulated Email/SMS OTP code for ${user.email} is: ${code}`);

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO mfa_challenges (id, userId, otp_hash, expires_at, attempts_count, max_attempts, consumed_at, resend_count, created_at, status)
       VALUES (?, ?, ?, ?, 0, ?, NULL, 0, ?, 'Pending')`,
      [challengeId, user.id, otpHash, expiresAt, MAX_ATTEMPTS, createdAt],
      (err) => {
        if (err) return reject(err);
        resolve({
          success: true,
          challengeId,
          expiresAt,
          // Expose dev hint code in test and development environments
          otpDevHint: process.env.NODE_ENV !== 'production' ? code : undefined
        });
      }
    );
  });
};

export const verifyOtp = async (challengeId, code) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM mfa_challenges WHERE id = ?", [challengeId], (err, challenge) => {
      if (err) return reject(err);
      if (!challenge) return resolve({ success: false, message: 'MFA session expired or invalid' });

      if (challenge.status === 'Verified' || challenge.consumed_at) {
        return resolve({ success: false, message: 'OTP already verified or consumed.' });
      }

      if (challenge.status === 'Blocked' || challenge.attempts_count >= challenge.max_attempts) {
        return resolve({ success: false, message: 'Too many incorrect attempts. Please sign in again.' });
      }

      const now = new Date().toISOString();
      if (now > challenge.expires_at) {
        return resolve({ success: false, message: 'OTP expired. Please request a new OTP.' });
      }

      // Strict hash match check (no fixed local testing bypasses)
      const match = bcrypt.compareSync(code, challenge.otp_hash);

      if (match) {
        const consumedAt = new Date().toISOString();
        db.run(
          "UPDATE mfa_challenges SET status = 'Verified', consumed_at = ? WHERE id = ?",
          [consumedAt, challengeId],
          (updateErr) => {
            if (updateErr) return reject(updateErr);
            resolve({ success: true, userId: challenge.userId });
          }
        );
      } else {
        const nextAttemptsCount = challenge.attempts_count + 1;
        const nextStatus = nextAttemptsCount >= challenge.max_attempts ? 'Blocked' : 'Pending';

        db.run(
          "UPDATE mfa_challenges SET attempts_count = ?, status = ? WHERE id = ?",
          [nextAttemptsCount, nextStatus, challengeId],
          (updateErr) => {
            if (updateErr) return reject(updateErr);
            if (nextStatus === 'Blocked') {
              resolve({ success: false, message: 'Too many incorrect attempts. Please sign in again.' });
            } else {
              resolve({ success: false, message: 'Invalid OTP code.' });
            }
          }
        );
      }
    });
  });
};

export const resendOtp = async (challengeId) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM mfa_challenges WHERE id = ?", [challengeId], (err, challenge) => {
      if (err) return reject(err);
      if (!challenge) return resolve({ success: false, message: 'MFA session expired or invalid' });

      if (challenge.resend_count >= MAX_RESENDS) {
        return resolve({ success: false, message: 'Maximum resend attempts reached for this session.' });
      }

      if (challenge.status === 'Verified' || challenge.consumed_at) {
        return resolve({ success: false, message: 'Session already completed.' });
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const salt = bcrypt.genSaltSync(10);
      const otpHash = bcrypt.hashSync(code, salt);
      
      const newExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();
      const nextResendCount = challenge.resend_count + 1;

      db.get("SELECT email FROM users WHERE id = ?", [challenge.userId], (userErr, user) => {
        if (userErr || !user) return resolve({ success: false, message: 'Associated user profile not found.' });

        console.log(`[MFA DELIVERY] Simulated Resent Email/SMS OTP code for ${user.email} is: ${code}`);

        db.run(
          `UPDATE mfa_challenges 
           SET otp_hash = ?, expires_at = ?, attempts_count = 0, resend_count = ?, status = 'Pending' 
           WHERE id = ?`,
          [otpHash, newExpiresAt, nextResendCount, challengeId],
          (updateErr) => {
            if (updateErr) return reject(updateErr);
            resolve({
              success: true,
              challengeId,
              expiresAt: newExpiresAt,
              otpDevHint: process.env.NODE_ENV !== 'production' ? code : undefined
            });
          }
        );
      });
    });
  });
};
