import { Role } from '../../security/roles/roles';

export type LanguageOption = 'en' | 'hi' | 'es' | 'fr' | 'de';

export interface HeaderNotification {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  path: string;
  read: boolean;
  targetRole?: Role[];
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  active?: boolean;
}

export interface HeaderState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  language: LanguageOption;
  notifications: HeaderNotification[];
  unreadNotificationCount: number;
  searchQuery: string;
  searchCategory: 'all' | 'employees' | 'departments' | 'reports' | 'security';
  searchFocused: boolean;
  activeDropdown: 'notif' | 'profile' | 'role' | 'language' | null;
}
