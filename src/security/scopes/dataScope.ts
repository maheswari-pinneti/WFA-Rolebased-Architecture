import { Role } from '../roles/roles';

export type ScopeLevel = 'ALL' | 'ORGANIZATION' | 'DEPARTMENT' | 'TEAM' | 'SELF';

export interface DataScope {
  organization: string;
  department: string;
  teams: string[];
  location: string[];
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
  [Role.ADMIN]: { organization: 'ALL', department: 'ALL', teams: ['ALL'], location: ['ALL'], level: 'ALL' },
  [Role.HR]: { organization: 'ALL', department: 'ALL', teams: ['ALL'], location: ['ALL'], level: 'ORGANIZATION' },
  [Role.MANAGER]: { organization: 'ALL', department: 'Engineering', teams: ['Frontend', 'Backend', 'QA'], location: ['ALL'], level: 'DEPARTMENT' },
  [Role.TEAM_LEAD]: { organization: 'ALL', department: 'Engineering', teams: ['Frontend Team'], location: ['ALL'], level: 'TEAM' },
  [Role.EMPLOYEE]: { organization: 'ALL', department: 'Engineering', teams: ['Frontend Team'], location: ['ALL'], level: 'SELF' },
};

export const validateDataScope = (
  userAttrs: UserABACAttributes,
  scope: DataScope,
  target?: ResourceTarget
): boolean => {
  if (!target) return true;

  if (userAttrs.role === Role.ADMIN) return true;

  if (scope.level === 'ALL' || scope.level === 'ORGANIZATION') return true;

  if (scope.level === 'SELF') {
    return target.ownerId === userAttrs.userId;
  }

  if (scope.level === 'TEAM') {
    if (target.team && scope.teams.includes(target.team)) return true;
    return target.ownerId === userAttrs.userId;
  }

  if (scope.level === 'DEPARTMENT') {
    if (scope.department === 'ALL') return true;
    return target.department === scope.department || target.department === userAttrs.department;
  }

  return false;
};
