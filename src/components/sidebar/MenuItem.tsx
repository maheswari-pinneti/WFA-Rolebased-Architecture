import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuItemConfig } from './types';
import { PermissionGuard } from './PermissionGuard';
import * as Icons from 'lucide-react';

interface MenuItemProps {
  item: MenuItemConfig;
  collapsed?: boolean;
  onSelect?: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item, collapsed, onSelect }) => {
  const location = useLocation();
  const isActive = item.path ? location.pathname === item.path : false;

  // Dynamically map icon component name from Lucide
  const IconComponent = (Icons as any)[item.icon] || Icons.Circle;

  const getBadgeStyle = (variant?: string) => {
    switch (variant) {
      case 'blue': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'purple': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'emerald': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'amber': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'rose': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <PermissionGuard roles={item.roles} permissions={item.permissions} departmentScope={item.departmentScope}>
      <Link
        to={item.path || '#'}
        onClick={onSelect}
        title={collapsed ? item.title : undefined}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
          isActive
            ? 'bg-blue-600/15 border border-blue-500/50 text-blue-500 font-bold shadow-md shadow-blue-500/10'
            : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-transparent hover:border-[var(--border-color)]'
        } ${collapsed ? 'justify-center px-0' : ''}`}
      >
        {/* Active Left Pill */}
        {isActive && !collapsed && (
          <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-blue-500 shadow-sm shadow-blue-400" />
        )}

        <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">
          <IconComponent size={20} strokeWidth={2} />
        </span>

        {!collapsed && (
          <span className="font-semibold text-xs tracking-tight truncate flex-1 min-w-0">
            {item.title}
          </span>
        )}

        {!collapsed && item.badge && (
          <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md border ml-auto shrink-0 ${getBadgeStyle(item.badge.variant)}`}>
            {item.badge.text}
          </span>
        )}

        {/* Collapsed Tooltip */}
        {collapsed && (
          <span className="absolute left-16 px-3 py-1.5 text-xs font-bold rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-50 whitespace-nowrap flex items-center gap-2">
            {item.title}
          </span>
        )}
      </Link>
    </PermissionGuard>
  );
};
