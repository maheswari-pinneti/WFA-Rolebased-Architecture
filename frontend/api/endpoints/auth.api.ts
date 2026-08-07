import { apiClient } from '../../services/api';
import { User } from '../../auth/types/auth.types';

export const authApi = {
  login: async (email: string): Promise<{ user: User; token: string }> => {
    const response = await apiClient.post('/v1/auth/login', { email });
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Login failed');
  },

  logout: async (): Promise<void> => {
    // Optional backend logout call
  }
};
