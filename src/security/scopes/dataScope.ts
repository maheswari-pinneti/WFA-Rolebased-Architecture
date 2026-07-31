import { Role } from '../roles/roles';

export type ScopeLevel = 'ALL' | 'ORGANIZATION' | 'DEPARTMENT' | 'TEAM' | 'LOCATION' | 'SELF';

export interface DataScope {
  organization: string; // 'ALL' or specific Org ID / 'Stackly Enterprise'
  department: string;   // 'ALL' or specific Department name (e.g. 'Engineering')
  teams: string[];       // ['ALL'] or specific team names (e.g. ['Frontend', 'Backend'])
  location: string[];    // ['ALL'] or specific locations (e.g. ['New York', 'London'])
  level: ScopeLevel;
}

export interface UserABACAttributes {
  userId: string;
  role: Role;
  organization: string;
  department: string;
  team: string;
  location: string;
  clearanceLevel: number;
  ipAddress?: string;
  deviceTrusted?: boolean;
}

export interface ResourceTarget {
  id: string;
  ownerId?: string;
  department?: string;
  team?: string;
  location?: string;
  sensitivityLevel?: number;
}

export const DEFAULT_ROLE_SCOPES: Record<Role, DataScope> = {
  [Role.SYSTEM_ADMIN]: { organization: 'ALL', department: 'ALL', teams: ['ALL'], location: ['ALL'], level: 'ALL' },
  [Role.PLATFORM_ADMIN]: { organization: 'ALL', department: 'ALL', teams: ['ALL'], location: ['ALL'], level: 'ALL' },
  [Role.SECURITY_ADMIN]: { organization: 'ALL', department: 'ALL', teams: ['ALL'], location: ['ALL'], level: 'ALL' },
  [Role.ORGANIZATION_ADMIN]: { organization: 'ALL', department: 'ALL', teams: ['ALL'], location: ['ALL'], level: 'ORGANIZATION' },
  [Role.HR_ADMIN]: { organization: 'ALL', department: 'ALL', teams: ['ALL'], location: ['ALL'], level: 'ALL' },
  [Role.HR_SPECIALIST]: { organization: 'ALL', department: 'ALL', teams: ['ALL'], location: ['ALL'], level: 'DEPARTMENT' },
  [Role.DEPARTMENT_HEAD]: { organization: 'ALL', department: 'Engineering', teams: ['ALL'], location: ['ALL'], level: 'DEPARTMENT' },
  [Role.BUSINESS_MANAGER]: { organization: 'ALL', department: 'Engineering', teams: ['Frontend', 'Backend'], location: ['ALL'], level: 'TEAM' },
  [Role.TEAM_LEAD]: { organization: 'ALL', department: 'Engineering', teams: ['Frontend'], location: ['ALL'], level: 'TEAM' },
  [Role.EMPLOYEE]: { organization: 'ALL', department: 'Engineering', teams: ['Frontend'], location: ['ALL'], level: 'SELF' },
  [Role.ANALYST]: { organization: 'ALL', department: 'ALL', teams: ['ALL'], location: ['ALL'], level: 'ALL' },
  [Role.AUDITOR]: { organization: 'ALL', department: 'ALL', teams: ['ALL'], location: ['ALL'], level: 'ALL' },
  [Role.VIEWER]: { organization: 'ALL', department: 'ALL', teams: ['ALL'], location: ['ALL'], level: 'ALL' },
};

/**
 * Validates if user attributes and data scope permit access to a specific resource target (ABAC + Scope)
 */
export const validateDataScope = (
  userAttrs: UserABACAttributes,
  scope: DataScope,
  target?: ResourceTarget
): boolean => {
  if (!target) return true;

  // Level 0 System Admins always pass
  if (scope.level === 'ALL') return true;

  // Self Scope (Level: SELF)
  if (scope.level === 'SELF') {
    return target.ownerId === userAttrs.userId;
  }

  // Team Scope (Level: TEAM)
  if (scope.level === 'TEAM') {
    if (scope.teams.includes('ALL')) return true;
    if (target.team && scope.teams.includes(target.team)) return true;
    return target.ownerId === userAttrs.userId;
  }

  // Department Scope (Level: DEPARTMENT)
  if (scope.level === 'DEPARTMENT') {
    if (scope.department === 'ALL') return true;
    return target.department === scope.department || target.department === userAttrs.department;
  }

  // Organization Scope (Level: ORGANIZATION)
  if (scope.level === 'ORGANIZATION') {
    if (scope.organization === 'ALL') return true;
    return target.department !== undefined; // Allows org-wide reads
  }

  return false;
};
