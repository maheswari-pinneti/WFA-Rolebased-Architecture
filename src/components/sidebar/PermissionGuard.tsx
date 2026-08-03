import React from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { Role } from '../../security/roles/roles';
import { Permission } from '../../security/permissions/permissions';

interface PermissionGuardProps {
  roles?: Role[];
  permissions?: Permission[];
  departmentScope?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  roles,
  permissions,
  departmentScope,
  children,
  fallback = null,
}) => {
  const { role, permissions: userPermissions, user } = useAuth();

  // Role validation check
  if (roles && roles.length > 0 && !roles.includes(role)) {
    return <>{fallback}</>;
  }

  // Permission validation check
  if (permissions && permissions.length > 0) {
    const hasPermission = permissions.every((p) => userPermissions.includes(p));
    if (!hasPermission) {
      return <>{fallback}</>;
    }
  }

  // DBAC Department Scope validation check
  if (departmentScope && departmentScope.length > 0 && user?.department) {
    if (!departmentScope.includes(user.department)) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};
