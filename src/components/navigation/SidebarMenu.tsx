import React from 'react';
import { RoleBasedMenu } from './RoleBasedMenu';
import { MenuItemConfig } from './MenuItem';

interface SidebarMenuProps {
  categories: { category: string; items: MenuItemConfig[] }[];
  collapsed?: boolean;
  filterQuery?: string;
  onItemClick?: () => void;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  categories,
  collapsed,
  filterQuery = '',
  onItemClick,
}) => {
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4 w-full scrollbar-thin scrollbar-thumb-slate-800">
      {categories.map((cat, groupIdx) => {
        const filteredItems = cat.items.filter((item) =>
          item.label.toLowerCase().includes(filterQuery.toLowerCase())
        );

        if (filterQuery && filteredItems.length === 0) return null;

        return (
          <div key={groupIdx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                {cat.category}
              </div>
            )}
            <RoleBasedMenu items={filteredItems} collapsed={collapsed} onItemClick={onItemClick} />
          </div>
        );
      })}
    </nav>
  );
};
