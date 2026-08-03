import React from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { roleBasedMenuConfigurations } from './menuConfig';
import { MenuGroup } from './MenuGroup';
import { Role } from '../../security/roles/roles';

interface RoleBasedMenuProps {
  collapsed?: boolean;
  filterQuery?: string;
  onSelectMenuItem?: () => void;
}

export const RoleBasedMenu: React.FC<RoleBasedMenuProps> = ({
  collapsed,
  filterQuery = '',
  onSelectMenuItem,
}) => {
  const { role } = useAuth();
  const menuGroups = roleBasedMenuConfigurations[role] || roleBasedMenuConfigurations[Role.EMPLOYEE];

  return (
    <div className="space-y-4">
      {menuGroups.map((group, idx) => (
        <MenuGroup
          key={idx}
          group={group}
          collapsed={collapsed}
          filterQuery={filterQuery}
          onSelectMenuItem={onSelectMenuItem}
        />
      ))}
    </div>
  );
};
