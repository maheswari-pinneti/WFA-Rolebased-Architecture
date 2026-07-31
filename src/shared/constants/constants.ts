export const APP_NAME = 'Stackly Workforce Analytics Platform';
export const API_TIMEOUT = 10000;
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'stackly_auth_token',
  USER_DATA: 'stackly_user_data',
  THEME_MODE: 'stackly_theme_mode'
};

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  CURRENT_USER: '/auth/me',
  EMPLOYEES: '/employees',
  DEPARTMENTS: '/departments',
  ROLES: '/roles',
  REPORTS: '/reports'
};
