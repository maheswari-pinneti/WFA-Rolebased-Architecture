import usersData from '../../mocks/data/users.json';
import { User } from '../../auth/types/auth.types';

let localUsers: User[] = [...(usersData as User[])];

export const userApi = {
  getUsers: async (): Promise<User[]> => {
    await new Promise((res) => setTimeout(res, 250));
    return [...localUsers];
  },

  updateUserRole: async (userId: string, newRole: User['role']): Promise<User> => {
    await new Promise((res) => setTimeout(res, 300));
    const index = localUsers.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error('User not found');
    localUsers[index] = { ...localUsers[index], role: newRole };
    return localUsers[index];
  },

  deleteUser: async (userId: string): Promise<boolean> => {
    await new Promise((res) => setTimeout(res, 300));
    localUsers = localUsers.filter((u) => u.id !== userId);
    return true;
  }
};
