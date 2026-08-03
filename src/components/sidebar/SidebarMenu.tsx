import React from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { roleBasedMenuConfigurations } from './menuConfig';
import { MenuGroup } from './MenuGroup';
import { Role } from '../../security/roles/roles';

interface SidebarMenuProps {
  collapsed?: boolean;
  filterQuery?: string;
  onSelectMenuItem?: () => void;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  collapsed,
  filterQuery = '',
  onSelectMenuItem,
}) => {
  const { role } = useAuth();
  const menuGroups = roleBasedMenuConfigurations[role] || roleBasedMenuConfigurations[Role.EMPLOYEE];

  return (
    <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 w-full custom-scrollbar">
      {menuGroups.map((group, idx) => (
        <MenuGroup
          key={idx}
          group={group}
          collapsed={collapsed}
          filterQuery={filterQuery}
          onSelectMenuItem={onSelectMenuItem}
        />
      ))}
    </nav>
  );
};
