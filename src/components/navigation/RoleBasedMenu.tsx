import React from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { MenuItem, MenuItemConfig } from './MenuItem';

interface RoleBasedMenuProps {
  items: MenuItemConfig[];
  collapsed?: boolean;
  onItemClick?: () => void;
}

export const RoleBasedMenu: React.FC<RoleBasedMenuProps> = ({ items, collapsed, onItemClick }) => {
  const { role, permissions } = useAuth();

  const filteredItems = items.filter((item) => {
    // 1. Role Match
    if (item.roles && item.roles.length > 0 && !item.roles.includes(role)) {
      return false;
    }
    // 2. Permission Match
    if (item.permissions && item.permissions.length > 0) {
      const hasPerm = item.permissions.some((p) => permissions.includes(p as any));
      if (!hasPerm) return false;
    }
    return true;
  });

  return (
    <div className="space-y-1">
      {filteredItems.map((item) => (
        <MenuItem key={item.id} item={item} collapsed={collapsed} onItemClick={onItemClick} />
      ))}
    </div>
  );
};
