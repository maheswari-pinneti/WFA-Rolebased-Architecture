import { authApi } from '../../api/endpoints/auth.api';
import { STORAGE_KEYS } from '../../shared/constants/constants';
import { apiClient } from '../../services/api';

export const authService = {
  login: async (email: string) => {
    const response = await authApi.login(email);
    // Only store session if login directly succeeded without MFA
    if (response && (response as any).token && (response as any).user) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, (response as any).token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify((response as any).user));
    }
    return response;
  },

  verifyMfa: async (tempToken: string, code: string) => {
    const response = await apiClient.post('/v1/auth/mfa-verify', { tempToken, code });
    if (response.data && response.data.success) {
      const { token, user } = response.data.data;
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      return { token, user };
    }
    throw new Error(response.data?.message || 'MFA OTP Verification failed');
  },

  logout: async () => {
    await authApi.logout();
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },

  getStoredSession: () => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);

    if (token && userData) {
      try {
        return {
          token,
          user: JSON.parse(userData)
        };
      } catch {
        return null;
      }
    }
    return null;
  }
};
