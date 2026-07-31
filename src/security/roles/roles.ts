export enum Role {
  ADMIN = 'ADMIN',
  HR = 'HR',
  TEAM_MANAGER = 'TEAM_MANAGER',
  TEAM_LEAD = 'TEAM_LEAD',
  EMPLOYEE = 'EMPLOYEE'
}

export const ROLE_LABELS: Record<Role, string> = {
  [Role.ADMIN]: 'System Administrator',
  [Role.HR]: 'HR Operations Manager',
  [Role.TEAM_MANAGER]: 'Department Manager',
  [Role.TEAM_LEAD]: 'Team Lead',
  [Role.EMPLOYEE]: 'Employee Self Service'
};
