import { useAuth } from '../../auth/hooks/useAuth';
import { Permission } from '../../security/permissions/permissions';
import { Role } from '../../security/roles/roles';
import { hasPermission, hasRole } from '../../security/policies/permissionMatrix';

export const usePermission = () => {
  const { role, permissions } = useAuth();

  const canAccess = (permission: Permission): boolean => {
    if (permissions && permissions.length > 0) {
      return permissions.includes(permission);
    }
    return hasPermission(role, permission);
  };

  const isRoleAllowed = (allowedRoles: Role[]): boolean => {
    return hasRole(role, allowedRoles);
  };

  return {
    canAccess,
    isRoleAllowed,
    userRole: role,
  };
};
