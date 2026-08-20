import { User, MfaChallenge } from '../models/User.js';
import { Session, RefreshToken } from '../models/RefreshToken.js';

export class UserRepository {
  async findByEmail(email) {
    return User.findOne({ email });
  }

  async findById(id) {
    return User.findOne({ id });
  }

  async findByScope(orgId) {
    return User.find({ organizationId: orgId }, {
      id: 1, name: 1, email: 1, role: 1, department: 1, team: 1, location: 1, title: 1, clearanceLevel: 1, status: 1, permissions: 1
    });
  }

  async create(userData) {
    return User.create(userData);
  }

  async updateRole(id, role, orgId) {
    return User.findOneAndUpdate(
      { id, organizationId: orgId },
      { $set: { role } },
      { new: true, projection: { id: 1, name: 1, email: 1, role: 1, department: 1, team: 1, location: 1, title: 1, clearanceLevel: 1, status: 1, permissions: 1 } }
    );
  }

  async delete(id, orgId) {
    return User.findOneAndDelete({ id, organizationId: orgId });
  }

  // Session Management
  async createSession(sessionData) {
    return Session.create(sessionData);
  }

  async findSessionById(sessionId) {
    return Session.findOne({ id: sessionId });
  }

  async updateSession(sessionId, update) {
    return Session.updateOne({ id: sessionId }, update);
  }

  // Refresh Token Management
  async createRefreshToken(tokenData) {
    return RefreshToken.create(tokenData);
  }

  async findRefreshTokenByHash(tokenHash) {
    return RefreshToken.findOne({ token_hash: tokenHash });
  }

  async updateRefreshToken(tokenHash, update) {
    return RefreshToken.updateOne({ token_hash: tokenHash }, update);
  }

  async revokeTokenFamily(tokenFamily, revokedAt) {
    return RefreshToken.updateMany({ tokenFamily }, { revokedAt });
  }

  async revokeActiveSessionTokens(sessionId, revokedAt) {
    return RefreshToken.updateMany(
      { sessionId, revokedAt: null },
      { revokedAt }
    );
  }

  // MFA Challenge Management
  async createMfaChallenge(challengeData) {
    return MfaChallenge.create(challengeData);
  }

  async findMfaChallengeById(challengeId) {
    return MfaChallenge.findOne({ id: challengeId });
  }

  async updateMfaChallenge(challengeId, update) {
    return MfaChallenge.updateOne({ id: challengeId }, update);
  }
}

export const userRepository = new UserRepository();
export default userRepository;
