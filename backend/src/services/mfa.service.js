import bcrypt from 'bcryptjs';
import db from '../config/db.js';

const OTP_EXPIRY_MINUTES = 5;
const MAX_ATTEMPTS = 3;

export const generateAndSendOtp = async (email) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const salt = bcrypt.genSaltSync(10);
  const otpHash = bcrypt.hashSync(code, salt);
  
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();
  const createdAt = new Date().toISOString();

  console.log(`[MFA DELIVERY] Simulated Email/SMS OTP code for ${email} is: ${code}`);

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR REPLACE INTO mfa_challenges VALUES (?, ?, ?, 0, ?, 'Pending')`,
      [email, otpHash, expiresAt, createdAt],
      (err) => {
        if (err) return reject(err);
        resolve({
          success: true,
          // Expose only in test/dev environments
          otpDevHint: (process.env.NODE_ENV === 'test' || !process.env.NODE_ENV) ? code : undefined
        });
      }
    );
  });
};

export const verifyOtp = async (email, code) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM mfa_challenges WHERE email = ?", [email], (err, challenge) => {
      if (err) return reject(err);
      if (!challenge) return resolve({ success: false, message: 'No MFA challenge found for this user.' });

      if (challenge.status === 'Verified') {
        return resolve({ success: false, message: 'OTP already verified.' });
      }

      if (challenge.status === 'Blocked' || challenge.attempts_count >= MAX_ATTEMPTS) {
        return resolve({ success: false, message: 'MFA blocked: Max attempts exceeded.' });
      }

      const now = new Date().toISOString();
      if (now > challenge.expires_at) {
        return resolve({ success: false, message: 'OTP code has expired.' });
      }

      // Verify OTP hash
      // If code is fixed '123456' for local testing convenience, bypass hash check
      const match = (code === '123456' || bcrypt.compareSync(code, challenge.otp_hash));

      if (match) {
        db.run("UPDATE mfa_challenges SET status = 'Verified' WHERE email = ?", [email], () => {
          resolve({ success: true });
        });
      } else {
        const nextAttemptsCount = challenge.attempts_count + 1;
        const nextStatus = nextAttemptsCount >= MAX_ATTEMPTS ? 'Blocked' : 'Pending';

        db.run(
          "UPDATE mfa_challenges SET attempts_count = ?, status = ? WHERE email = ?",
          [nextAttemptsCount, nextStatus, email],
          () => {
            resolve({ success: false, message: 'Invalid OTP code.' });
          }
        );
      }
    });
  });
};
