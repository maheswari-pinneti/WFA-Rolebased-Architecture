import usersData from '../../mocks/data/users.json';
import { User } from '../../auth/types/auth.types';

export const authApi = {
  login: async (email: string): Promise<{ user: User; token: string }> => {
    // Simulate network latency
    await new Promise((res) => setTimeout(res, 400));
    
    const users = usersData as User[];
    const normalizedEmail = email.toLowerCase().trim();
    const prefix = normalizedEmail.split('@')[0];

    let matchedUser = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!matchedUser) {
      if (prefix.includes('admin')) matchedUser = users.find((u) => u.role === 'ADMIN');
      else if (prefix.includes('hr')) matchedUser = users.find((u) => u.role === 'HR');
      else if (prefix.includes('manager')) matchedUser = users.find((u) => u.role === 'MANAGER');
      else if (prefix.includes('lead')) matchedUser = users.find((u) => u.role === 'TEAM_LEAD');
      else if (prefix.includes('emp') || prefix.includes('john') || prefix.includes('alex')) matchedUser = users.find((u) => u.role === 'EMPLOYEE');
      else matchedUser = users[0]; // fallback to default admin
    }

    return {
      user: matchedUser || users[0],
      token: `mock-jwt-token-${matchedUser?.id || '01'}-${Date.now()}`
    };
  },

  logout: async (): Promise<void> => {
    await new Promise((res) => setTimeout(res, 200));
  }
};
