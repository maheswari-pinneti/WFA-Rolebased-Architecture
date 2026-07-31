export enum Role {
  ADMIN = 'ADMIN',
  HR = 'HR',
  MANAGER = 'MANAGER',
  TEAM_LEAD = 'TEAM_LEAD',
  EMPLOYEE = 'EMPLOYEE',

  // Legacy compatibility mappings
  SYSTEM_ADMIN = 'ADMIN',
  PLATFORM_ADMIN = 'ADMIN',
  SECURITY_ADMIN = 'ADMIN',
  ORGANIZATION_ADMIN = 'ADMIN',
  HR_ADMIN = 'HR',
  HR_SPECIALIST = 'HR',
  DEPARTMENT_HEAD = 'MANAGER',
  BUSINESS_MANAGER = 'MANAGER',
  TEAM_MANAGER = 'MANAGER',
  ANALYST = 'MANAGER',
  AUDITOR = 'ADMIN',
  VIEWER = 'EMPLOYEE',
}

export const ROLE_LABELS: Record<Role, string> = {
  [Role.ADMIN]: 'System Administrator',
  [Role.HR]: 'HR Operations Manager',
  [Role.MANAGER]: 'Department Manager',
  [Role.TEAM_LEAD]: 'Team Lead (TL)',
  [Role.EMPLOYEE]: 'Employee Self Service',
};

export const ROLE_HOME_PATHS: Record<Role, string> = {
  [Role.ADMIN]: '/admin/dashboard',
  [Role.HR]: '/hr/dashboard',
  [Role.MANAGER]: '/manager/dashboard',
  [Role.TEAM_LEAD]: '/team-lead/dashboard',
  [Role.EMPLOYEE]: '/employee/dashboard',
};

export const ROLE_LEVELS: Record<Role, number> = {
  [Role.ADMIN]: 0,
  [Role.HR]: 1,
  [Role.MANAGER]: 2,
  [Role.TEAM_LEAD]: 3,
  [Role.EMPLOYEE]: 4,
};

export const ROLE_CATEGORIES: Record<Role, 'System' | 'HR' | 'Management' | 'Operational'> = {
  [Role.ADMIN]: 'System',
  [Role.HR]: 'HR',
  [Role.MANAGER]: 'Management',
  [Role.TEAM_LEAD]: 'Operational',
  [Role.EMPLOYEE]: 'Operational',
};
