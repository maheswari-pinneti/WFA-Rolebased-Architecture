import { Role } from '../roles/roles';
import { Permission } from '../permissions/permissions';

export const PERMISSION_MATRIX: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    Permission.USERS_READ,
    Permission.USERS_CREATE,
    Permission.USERS_UPDATE,
    Permission.USERS_DELETE,
    Permission.ROLES_MANAGE,
    Permission.SYSTEM_CONFIG,
    Permission.EMPLOYEE_READ,
    Permission.EMPLOYEE_MANAGE,
    Permission.EMPLOYEE_SELF,
    Permission.ATTENDANCE_CLOCK,
    Permission.ATTENDANCE_READ_SELF,
    Permission.ATTENDANCE_READ_TEAM,
    Permission.ATTENDANCE_MANAGE,
    Permission.ANALYTICS_VIEW_ALL,
    Permission.ANALYTICS_VIEW_TEAM,
    Permission.REPORTS_EXPORT,
    Permission.PERFORMANCE_READ_SELF,
    Permission.PERFORMANCE_READ_TEAM,
    Permission.PERFORMANCE_MANAGE,
  ],
  [Role.HR]: [
    Permission.USERS_READ,
    Permission.EMPLOYEE_READ,
    Permission.EMPLOYEE_MANAGE,
    Permission.EMPLOYEE_SELF,
    Permission.ATTENDANCE_CLOCK,
    Permission.ATTENDANCE_READ_SELF,
    Permission.ATTENDANCE_READ_TEAM,
    Permission.ATTENDANCE_MANAGE,
    Permission.ANALYTICS_VIEW_ALL,
    Permission.ANALYTICS_VIEW_TEAM,
    Permission.REPORTS_EXPORT,
    Permission.PERFORMANCE_READ_SELF,
    Permission.PERFORMANCE_READ_TEAM,
  ],
  [Role.TEAM_MANAGER]: [
    Permission.EMPLOYEE_READ,
    Permission.EMPLOYEE_SELF,
    Permission.ATTENDANCE_CLOCK,
    Permission.ATTENDANCE_READ_SELF,
    Permission.ATTENDANCE_READ_TEAM,
    Permission.ANALYTICS_VIEW_TEAM,
    Permission.REPORTS_EXPORT,
    Permission.PERFORMANCE_READ_SELF,
    Permission.PERFORMANCE_READ_TEAM,
    Permission.PERFORMANCE_MANAGE,
  ],
  [Role.TEAM_LEAD]: [
    Permission.EMPLOYEE_READ,
    Permission.EMPLOYEE_SELF,
    Permission.ATTENDANCE_CLOCK,
    Permission.ATTENDANCE_READ_SELF,
    Permission.ATTENDANCE_READ_TEAM,
    Permission.ANALYTICS_VIEW_TEAM,
    Permission.PERFORMANCE_READ_SELF,
    Permission.PERFORMANCE_READ_TEAM,
  ],
  [Role.EMPLOYEE]: [
    Permission.EMPLOYEE_SELF,
    Permission.ATTENDANCE_CLOCK,
    Permission.ATTENDANCE_READ_SELF,
    Permission.PERFORMANCE_READ_SELF,
  ]
};

export const hasPermission = (userRole: Role, permission: Permission): boolean => {
  const allowedPermissions = PERMISSION_MATRIX[userRole] || [];
  return allowedPermissions.includes(permission);
};

export const hasRole = (userRole: Role, allowedRoles: Role[]): boolean => {
  return allowedRoles.includes(userRole);
};
