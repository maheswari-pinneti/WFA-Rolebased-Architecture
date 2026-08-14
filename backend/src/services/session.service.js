import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { run, get, all } from '../database/connection.js';
import { env } from '../config/env.js';

const JWT_SECRET = env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRY = '15m'; // Short-lived access token
const REFRESH_TOKEN_EXPIRY_DAYS = 7; // Long-lived refresh token

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

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
  organizationId: user.organizationId || 'org-stackly',
  permissions: typeof user.permissions === 'string' ? JSON.parse(user.permissions || '[]') : user.permissions
});

export const signAccessToken = (user) => {
  return jwt.sign(
    {
      ...toUser(user),
      requiresMfa: false
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

export const createSession = async (user, ipAddress = '', deviceFingerprint = '') => {
  const sessionId = crypto.randomUUID();
  const rawRefreshToken = crypto.randomBytes(40).toString('hex');
  const refreshTokenHash = hashToken(rawRefreshToken);
  const tokenFamily = crypto.randomUUID();

  const now = new Date().toISOString();
  const sessionExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString();

  // Create session
  await run(
    `INSERT INTO sessions (id, userId, deviceFingerprint, ipAddress, createdAt, expiresAt, revokedAt)
     VALUES (?, ?, ?, ?, ?, ?, NULL)`,
    [sessionId, user.id, deviceFingerprint, ipAddress, now, sessionExpiresAt]
  );

  // Store refresh token
  await run(
    `INSERT INTO refresh_tokens (token_hash, sessionId, tokenFamily, parentHash, expiresAt, revokedAt)
     VALUES (?, ?, ?, NULL, ?, NULL)`,
    [refreshTokenHash, sessionId, tokenFamily, sessionExpiresAt]
  );

  const accessToken = signAccessToken(user);

  return {
    accessToken,
    refreshToken: rawRefreshToken,
    sessionId
  };
};

export const rotateRefreshToken = async (oldRefreshToken, ipAddress = '', deviceFingerprint = '') => {
  const oldHash = hashToken(oldRefreshToken);
  const now = new Date().toISOString();

  // Get refresh token info
  const tokenRecord = await get(
    `SELECT rt.*, s.userId, s.revokedAt AS sessionRevokedAt, s.expiresAt AS sessionExpiresAt
     FROM refresh_tokens rt
     JOIN sessions s ON rt.sessionId = s.id
     WHERE rt.token_hash = ?`,
    [oldHash]
  );

  if (!tokenRecord) {
    throw new Error('Invalid refresh token');
  }

  const { sessionId, tokenFamily, expiresAt, revokedAt, sessionRevokedAt, userId } = tokenRecord;

  // 1. REUSE DETECTION: If token is already revoked, revoke the entire token family
  if (revokedAt || sessionRevokedAt || now > expiresAt) {
    if (revokedAt) {
      console.warn(`[SECURITY WARNING] Refresh token reuse detected! Revoking family: ${tokenFamily}`);
      // Revoke all tokens in the same family
      await run(`UPDATE refresh_tokens SET revokedAt = ? WHERE tokenFamily = ?`, [now, tokenFamily]);
      // Revoke the session
      await run(`UPDATE sessions SET revokedAt = ? WHERE id = ?`, [now, sessionId]);
    }
    throw new Error('Refresh token revoked or expired');
  }

  // Fetch full user record to sign new access token
  const user = await get("SELECT * FROM users WHERE id = ?", [userId]);
  if (!user || user.status !== 'ACTIVE') {
    throw new Error('User inactive or not found');
  }

  // 2. Rotate: Revoke the old token
  await run(`UPDATE refresh_tokens SET revokedAt = ? WHERE token_hash = ?`, [now, oldHash]);

  // Create new refresh token in the same family
  const newRefreshToken = crypto.randomBytes(40).toString('hex');
  const newHash = hashToken(newRefreshToken);
  const tokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString();

  await run(
    `INSERT INTO refresh_tokens (token_hash, sessionId, tokenFamily, parentHash, expiresAt, revokedAt)
     VALUES (?, ?, ?, ?, ?, NULL)`,
    [newHash, sessionId, tokenFamily, oldHash, tokenExpiresAt]
  );

  const accessToken = signAccessToken(user);

  return {
    accessToken,
    refreshToken: newRefreshToken
  };
};

export const revokeSession = async (sessionId) => {
  const now = new Date().toISOString();
  await run(`UPDATE sessions SET revokedAt = ? WHERE id = ?`, [now, sessionId]);
  await run(
    `UPDATE refresh_tokens 
     SET revokedAt = ? 
     WHERE sessionId = ? AND revokedAt IS NULL`,
    [now, sessionId]
  );
};

export const revokeRefreshToken = async (refreshToken) => {
  const hash = hashToken(refreshToken);
  const tokenRecord = await get("SELECT sessionId FROM refresh_tokens WHERE token_hash = ?", [hash]);
  if (tokenRecord) {
    await revokeSession(tokenRecord.sessionId);
  }
};
