export enum Permission {
  // User Management
  USERS_READ = 'users:read',
  USERS_CREATE = 'users:create',
  USERS_UPDATE = 'users:update',
  USERS_DELETE = 'users:delete',
  
  // Role & Policy Management
  ROLES_MANAGE = 'roles:manage',
  SYSTEM_CONFIG = 'system:config',

  // Employee Directory
  EMPLOYEE_READ = 'employee:read',
  EMPLOYEE_MANAGE = 'employee:manage',
  EMPLOYEE_SELF = 'employee:self',

  // Attendance
  ATTENDANCE_CLOCK = 'attendance:clock',
  ATTENDANCE_READ_SELF = 'attendance:read_self',
  ATTENDANCE_READ_TEAM = 'attendance:read_team',
  ATTENDANCE_MANAGE = 'attendance:manage',

  // Analytics & Reports
  ANALYTICS_VIEW_ALL = 'analytics:view_all',
  ANALYTICS_VIEW_TEAM = 'analytics:view_team',
  REPORTS_EXPORT = 'reports:export',

  // Performance
  PERFORMANCE_READ_SELF = 'performance:read_self',
  PERFORMANCE_READ_TEAM = 'performance:read_team',
  PERFORMANCE_MANAGE = 'performance:manage'
}
