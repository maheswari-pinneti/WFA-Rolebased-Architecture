import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password_hash: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, default: null },
  team: { type: String, default: null },
  location: { type: String, default: null },
  title: { type: String, default: null },
  clearanceLevel: { type: Number, default: 1 },
  status: { type: String, default: 'ACTIVE' },
  permissions: { type: [String], default: [] },
  mfa_enabled: { type: Number, default: 1 },
  organizationId: { type: String, default: 'org-stackly' },
  companyId: { type: String, default: 'org-stackly', index: true }
}, {
  timestamps: true,
  collection: 'users'
});

const mfaChallengeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  otp_hash: { type: String, required: true },
  expires_at: { type: String, required: true },
  attempts_count: { type: Number, default: 0 },
  max_attempts: { type: Number, default: 5 },
  consumed_at: { type: String, default: null },
  resend_count: { type: Number, default: 0 },
  created_at: { type: String, default: () => new Date().toISOString() },
  status: { type: String, default: 'Pending' },
  organizationId: { type: String, default: 'org-stackly' },
  companyId: { type: String, default: 'org-stackly', index: true }
}, {
  timestamps: true,
  collection: 'mfachallenges'
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const MfaChallenge = mongoose.models.MfaChallenge || mongoose.model('MfaChallenge', mfaChallengeSchema);
export default User;
