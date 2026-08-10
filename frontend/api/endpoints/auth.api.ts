import { apiClient } from '../../services/api';

export const authApi = {
  login: async (email: string): Promise<any> => {
    const response = await apiClient.post('/v1/auth/login', { email: email.trim().toLowerCase() });
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Login failed');
  },

  logout: async (): Promise<void> => {
    // Optional backend logout call
  }
};
