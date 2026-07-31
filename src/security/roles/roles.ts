export enum Role {
  // System & Infrastructure (Level 0 - Level 1)
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
  SECURITY_ADMIN = 'SECURITY_ADMIN',

  // Organizational Leadership
  ORGANIZATION_ADMIN = 'ORGANIZATION_ADMIN',
  HR_ADMIN = 'HR_ADMIN',
  HR_SPECIALIST = 'HR_SPECIALIST',

  // Operations & Management
  DEPARTMENT_HEAD = 'DEPARTMENT_HEAD',
  BUSINESS_MANAGER = 'BUSINESS_MANAGER',
  TEAM_LEAD = 'TEAM_LEAD',
  EMPLOYEE = 'EMPLOYEE',

  // Analytics, Compliance & Read-Only
  ANALYST = 'ANALYST',
  AUDITOR = 'AUDITOR',
  VIEWER = 'VIEWER',

  // Legacy Compatibility Aliases
  ADMIN = 'SYSTEM_ADMIN',
  HR = 'HR_ADMIN',
  TEAM_MANAGER = 'BUSINESS_MANAGER',
}

export const ROLE_LABELS: Record<Role, string> = {
  [Role.SYSTEM_ADMIN]: 'System Administrator',
  [Role.PLATFORM_ADMIN]: 'Platform Administrator',
  [Role.SECURITY_ADMIN]: 'Security & Compliance Admin',
  [Role.ORGANIZATION_ADMIN]: 'Organization Administrator',
  [Role.HR_ADMIN]: 'HR Administrator',
  [Role.HR_SPECIALIST]: 'HR Specialist',
  [Role.DEPARTMENT_HEAD]: 'Department Head',
  [Role.BUSINESS_MANAGER]: 'Business Manager',
  [Role.TEAM_LEAD]: 'Team Lead',
  [Role.EMPLOYEE]: 'Employee Self Service',
  [Role.ANALYST]: 'Analytics Specialist',
  [Role.AUDITOR]: 'Compliance Auditor',
  [Role.VIEWER]: 'Read-Only Viewer',
};

export const ROLE_LEVELS: Record<Role, number> = {
  [Role.SYSTEM_ADMIN]: 0,
  [Role.PLATFORM_ADMIN]: 1,
  [Role.SECURITY_ADMIN]: 1,
  [Role.ORGANIZATION_ADMIN]: 2,
  [Role.HR_ADMIN]: 3,
  [Role.HR_SPECIALIST]: 4,
  [Role.DEPARTMENT_HEAD]: 3,
  [Role.BUSINESS_MANAGER]: 4,
  [Role.TEAM_LEAD]: 5,
  [Role.EMPLOYEE]: 6,
  [Role.ANALYST]: 4,
  [Role.AUDITOR]: 2,
  [Role.VIEWER]: 7,
};

export const ROLE_CATEGORIES: Record<Role, 'System' | 'HR' | 'Management' | 'Operational' | 'Audit'> = {
  [Role.SYSTEM_ADMIN]: 'System',
  [Role.PLATFORM_ADMIN]: 'System',
  [Role.SECURITY_ADMIN]: 'System',
  [Role.ORGANIZATION_ADMIN]: 'Management',
  [Role.HR_ADMIN]: 'HR',
  [Role.HR_SPECIALIST]: 'HR',
  [Role.DEPARTMENT_HEAD]: 'Management',
  [Role.BUSINESS_MANAGER]: 'Management',
  [Role.TEAM_LEAD]: 'Operational',
  [Role.EMPLOYEE]: 'Operational',
  [Role.ANALYST]: 'Audit',
  [Role.AUDITOR]: 'Audit',
  [Role.VIEWER]: 'Operational',
};
