import { authApi } from '../../api/endpoints/auth.api';
import { STORAGE_KEYS } from '../../shared/constants/constants';

export const authService = {
  login: async (email: string) => {
    const response = await authApi.login(email);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
    return response;
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
