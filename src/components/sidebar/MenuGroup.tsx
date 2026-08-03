import React from 'react';
import { MenuGroupConfig } from './types';
import { MenuItem } from './MenuItem';

interface MenuGroupProps {
  group: MenuGroupConfig;
  collapsed?: boolean;
  filterQuery?: string;
  onSelectMenuItem?: () => void;
}

export const MenuGroup: React.FC<MenuGroupProps> = ({
  group,
  collapsed,
  filterQuery = '',
  onSelectMenuItem,
}) => {
  const filteredItems = group.items.filter((item) =>
    item.title.toLowerCase().includes(filterQuery.toLowerCase())
  );

  if (filteredItems.length === 0) return null;

  return (
    <div className="space-y-1">
      {!collapsed && (
        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400/80">
          {group.groupTitle}
        </div>
      )}
      {filteredItems.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          collapsed={collapsed}
          onSelect={onSelectMenuItem}
        />
      ))}
    </div>
  );
};
