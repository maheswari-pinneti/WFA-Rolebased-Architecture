import { Role } from '../../security/roles/roles';
import { Permission } from '../../security/permissions/permissions';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  department: string;
  title: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  permissions: Permission[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginResponse {
  user: User;
  token: string;
}
