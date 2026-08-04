import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

export interface MenuItemConfig {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
  permissions?: string[];
  badge?: {
    text: string;
    variant: 'blue' | 'purple' | 'amber' | 'emerald' | 'rose';
  };
  subItems?: { label: string; path: string }[];
}

interface MenuItemProps {
  item: MenuItemConfig;
  collapsed?: boolean;
  onItemClick?: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item, collapsed, onItemClick }) => {
  const location = useLocation();
  const [subOpen, setSubOpen] = useState(false);
  const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

  const getBadgeStyle = (variant: 'blue' | 'purple' | 'amber' | 'emerald' | 'rose') => {
    switch (variant) {
      case 'blue':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'purple':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'amber':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'emerald':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'rose':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  if (item.subItems && item.subItems.length > 0 && !collapsed) {
    return (
      <div className="space-y-1 font-sans">
        <button
          onClick={() => setSubOpen(!subOpen)}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
            isActive
              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 border border-blue-500/40'
              : 'hover:bg-slate-800/80 text-slate-300 hover:text-white border border-transparent hover:border-slate-700/80'
          }`}
        >
          <span className="flex items-center gap-3">
            <span className="shrink-0">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </span>
          <div className="flex items-center gap-2">
            {item.badge && (
              <span className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded-md border ${getBadgeStyle(item.badge.variant)}`}>
                {item.badge.text}
              </span>
            )}
            {subOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
        </button>

        {subOpen && (
          <div className="pl-4 space-y-1 border-l-2 border-slate-800 ml-3 py-1 animate-fadeIn">
            {item.subItems.map((sub, idx) => (
              <NavLink
                key={idx}
                to={sub.path}
                onClick={onItemClick}
                className={({ isActive: subActive }) =>
                  `block px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                    subActive
                      ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`
                }
              >
                {sub.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      onClick={onItemClick}
      className={({ isActive: active }) =>
        `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs transition-all duration-200 group relative no-underline text-inherit ${
          active
            ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-extrabold shadow-lg shadow-blue-500/25 border border-blue-500/40'
            : 'hover:bg-slate-800/80 text-slate-300 hover:text-white border border-transparent hover:border-slate-700/80'
        } ${collapsed ? 'justify-center px-0' : ''}`
      }
      title={collapsed ? item.label : undefined}
    >
      <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
      {!collapsed && <span className="font-extrabold text-xs tracking-tight truncate flex-1 min-w-0">{item.label}</span>}
      {!collapsed && item.badge && (
        <span className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded-md border ml-auto shrink-0 ${getBadgeStyle(item.badge.variant)}`}>
          {item.badge.text}
        </span>
      )}
      {collapsed && (
        <span className="absolute left-16 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-900 text-slate-100 border border-slate-700 shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 whitespace-nowrap">
          {item.label}
        </span>
      )}
    </NavLink>
  );
};
