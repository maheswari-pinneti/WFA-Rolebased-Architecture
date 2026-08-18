import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  deviceFingerprint: { type: String, default: null },
  ipAddress: { type: String, default: null },
  createdAt: { type: String, required: true },
  expiresAt: { type: String, required: true },
  revokedAt: { type: String, default: null },
  companyId: { type: String, default: 'org-stackly', index: true }
}, { timestamps: true, collection: 'sessions' });

const refreshTokenSchema = new mongoose.Schema({
  token_hash: { type: String, required: true, unique: true, index: true },
  sessionId: { type: String, required: true, index: true },
  tokenFamily: { type: String, required: true },
  parentHash: { type: String, default: null },
  expiresAt: { type: String, required: true },
  revokedAt: { type: String, default: null },
  companyId: { type: String, default: 'org-stackly', index: true }
}, { timestamps: true, collection: 'refreshtokens' });

export const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);
export const RefreshToken = mongoose.models.RefreshToken || mongoose.model('RefreshToken', refreshTokenSchema);
export default RefreshToken;
