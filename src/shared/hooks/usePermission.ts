import { useAuth } from '../../auth/hooks/useAuth';
import { Permission } from '../../security/permissions/permissions';
import { PERMISSION_MATRIX } from '../../security/policies/permissionMatrix';
import { Role } from '../../security/roles/roles';

export const usePermission = () => {
  const { role } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!role) return false;
    const permissions = PERMISSION_MATRIX[role as Role] || [];
    return permissions.includes(permission);
  };

  const hasRole = (allowedRoles: Role[]): boolean => {
    if (!role) return false;
    return allowedRoles.includes(role as Role);
  };

  return {
    hasPermission,
    canAccess: hasPermission,
    hasRole,
    isRoleAllowed: hasRole,
    currentRole: role
  };
};
