import usersData from '../../mocks/data/users.json';
import { User } from '../../auth/types/auth.types';

export const authApi = {
  login: async (email: string): Promise<{ user: User; token: string }> => {
    // Simulate network latency
    await new Promise((res) => setTimeout(res, 400));
    
    const matchedUser = (usersData as User[]).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!matchedUser) {
      throw new Error(`Invalid credentials. Pre-configured demo emails: admin@company.com, hr@company.com, manager@company.com, lead@company.com, employee@company.com`);
    }

    return {
      user: matchedUser,
      token: `mock-jwt-token-${matchedUser.id}-${Date.now()}`
    };
  },

  logout: async (): Promise<void> => {
    await new Promise((res) => setTimeout(res, 200));
  }
};
