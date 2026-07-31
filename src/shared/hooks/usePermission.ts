import { useAuth } from '../../auth/hooks/useAuth';
import { Permission } from '../../security/permissions/permissions';
import { ENTERPRISE_ROLE_PERMISSION_MAP } from '../../security/policies/accessPolicies';
import { Role } from '../../security/roles/roles';
import { DEFAULT_ROLE_SCOPES, ResourceTarget } from '../../security/scopes/dataScope';
import { PolicyEngine } from '../../security/authorization/policyEngine';

export const usePermission = () => {
  const { user, role } = useAuth();

  const userScope = DEFAULT_ROLE_SCOPES[role] || DEFAULT_ROLE_SCOPES[Role.EMPLOYEE];

  const hasPermission = (permission: Permission): boolean => {
    if (!role) return false;
    const permissions = ENTERPRISE_ROLE_PERMISSION_MAP[role] || [];
    if (permissions.includes(Permission.SYSTEM_ALL)) return true;
    return permissions.includes(permission);
  };

  const hasRole = (allowedRoles: Role[]): boolean => {
    if (!role) return false;
    return allowedRoles.includes(role);
  };

  const authorize = (requiredPermission: Permission, targetResource?: ResourceTarget) => {
    const userAttrs = {
      userId: user?.id || 'anonymous',
      role: role || Role.EMPLOYEE,
      organization: 'Stackly Enterprise',
      department: user?.department || 'Engineering',
      team: user?.team || 'Frontend Core',
      location: user?.location || 'San Francisco',
      clearanceLevel: user?.clearanceLevel || 1,
    };

    return PolicyEngine.authorize(
      { user: userAttrs, scope: userScope },
      requiredPermission,
      targetResource
    );
  };

  return {
    hasPermission,
    hasRole,
    authorize,
    canAccess: hasPermission,
    isRoleAllowed: hasRole,
    userScope,
    currentRole: role,
  };
};
