import { Role } from '../roles/roles';
import { Permission } from '../permissions/permissions';
import { DataScope, DEFAULT_ROLE_SCOPES } from '../scopes/dataScope';

export const ENTERPRISE_ROLE_PERMISSION_MAP: Record<Role, Permission[]> = {
  [Role.SYSTEM_ADMIN]: [
    Permission.SYSTEM_ALL,
    Permission.USER_ALL,
    Permission.ROLE_ALL,
    Permission.PERMISSION_ALL,
    Permission.SECURITY_ALL,
    Permission.CONFIGURATION_ALL,
    Permission.AUDIT_ALL,
    Permission.EMPLOYEE_CREATE,
    Permission.EMPLOYEE_READ,
    Permission.EMPLOYEE_UPDATE,
    Permission.EMPLOYEE_DELETE,
    Permission.DASHBOARD_VIEW,
    Permission.REPORT_EXPORT,
  ],
  [Role.PLATFORM_ADMIN]: [
    Permission.APPLICATION_MANAGE,
    Permission.MODULE_ENABLE,
    Permission.FEATURE_CONFIGURE,
    Permission.WORKFLOW_CONFIGURE,
    Permission.NOTIFICATION_CONFIGURE,
    Permission.DASHBOARD_VIEW,
    Permission.REPORT_VIEW,
  ],
  [Role.SECURITY_ADMIN]: [
    Permission.ROLE_CREATE,
    Permission.ROLE_UPDATE,
    Permission.ROLE_DELETE,
    Permission.PERMISSION_ASSIGN,
    Permission.ACCESS_POLICY_MANAGE,
    Permission.LOGIN_POLICY_MANAGE,
    Permission.AUDIT_VIEW,
    Permission.AUDIT_LOG_VIEW,
    Permission.ACCESS_HISTORY_VIEW,
  ],
  [Role.ORGANIZATION_ADMIN]: [
    Permission.ORG_VIEW,
    Permission.ORG_UPDATE,
    Permission.LOCATION_MANAGE,
    Permission.DEPARTMENT_MANAGE,
    Permission.EMPLOYEE_STRUCTURE_MANAGE,
    Permission.EMPLOYEE_READ,
    Permission.DASHBOARD_VIEW,
    Permission.HEADCOUNT_VIEW,
  ],
  [Role.HR_ADMIN]: [
    Permission.EMPLOYEE_CREATE,
    Permission.EMPLOYEE_UPDATE,
    Permission.EMPLOYEE_DELETE,
    Permission.EMPLOYEE_READ,
    Permission.ATTENDANCE_MANAGE,
    Permission.LEAVE_MANAGE,
    Permission.PAYROLL_VIEW,
    Permission.PERFORMANCE_MANAGE,
    Permission.RECRUITMENT_MANAGE,
    Permission.DASHBOARD_VIEW,
    Permission.REPORT_EXPORT,
  ],
  [Role.HR_SPECIALIST]: [
    Permission.RECRUITMENT_VIEW,
    Permission.CANDIDATE_MANAGE,
    Permission.INTERVIEW_SCHEDULE,
    Permission.SALARY_REPORT_VIEW,
    Permission.SHIFT_MANAGE,
    Permission.EMPLOYEE_READ,
    Permission.ATTENDANCE_MANAGE,
    Permission.REPORT_VIEW,
  ],
  [Role.DEPARTMENT_HEAD]: [
    Permission.DEPARTMENT_ANALYTICS_VIEW,
    Permission.TEAM_PERFORMANCE_VIEW,
    Permission.HEADCOUNT_VIEW,
    Permission.REPORT_EXPORT,
    Permission.EMPLOYEE_READ,
    Permission.DASHBOARD_VIEW,
    Permission.REPORT_VIEW,
  ],
  [Role.BUSINESS_MANAGER]: [
    Permission.TEAM_VIEW,
    Permission.TEAM_ANALYTICS,
    Permission.APPROVE_LEAVE,
    Permission.APPROVE_REQUESTS,
    Permission.PERFORMANCE_REVIEW,
    Permission.EMPLOYEE_READ,
    Permission.REPORT_VIEW,
  ],
  [Role.TEAM_LEAD]: [
    Permission.TEAM_VIEW,
    Permission.TASK_TRACK,
    Permission.ATTENDANCE_VIEW,
    Permission.PRODUCTIVITY_VIEW,
    Permission.FEEDBACK_CREATE,
    Permission.EMPLOYEE_READ,
  ],
  [Role.EMPLOYEE]: [
    Permission.PROFILE_VIEW,
    Permission.PROFILE_UPDATE,
    Permission.ATTENDANCE_VIEW,
    Permission.LEAVE_REQUEST,
    Permission.PAYSLIP_VIEW,
    Permission.PERFORMANCE_VIEW,
  ],
  [Role.ANALYST]: [
    Permission.DASHBOARD_VIEW,
    Permission.REPORT_CREATE,
    Permission.DATA_EXPORT,
    Permission.TREND_ANALYSIS,
    Permission.CHART_VIEW,
    Permission.REPORT_VIEW,
  ],
  [Role.AUDITOR]: [
    Permission.AUDIT_LOG_VIEW,
    Permission.ACCESS_HISTORY_VIEW,
    Permission.REPORT_VIEW,
    Permission.DASHBOARD_VIEW,
    Permission.CHART_VIEW,
  ],
  [Role.VIEWER]: [
    Permission.DASHBOARD_VIEW,
    Permission.CHART_VIEW,
    Permission.REPORT_VIEW,
  ],
};

// Re-export PERMISSION_MATRIX alias for legacy codebase support
export const PERMISSION_MATRIX = ENTERPRISE_ROLE_PERMISSION_MAP;

export const getRolePermissions = (role: Role): Permission[] => {
  return ENTERPRISE_ROLE_PERMISSION_MAP[role] || [];
};

export const getRoleScope = (role: Role): DataScope => {
  return DEFAULT_ROLE_SCOPES[role] || DEFAULT_ROLE_SCOPES[Role.EMPLOYEE];
};
