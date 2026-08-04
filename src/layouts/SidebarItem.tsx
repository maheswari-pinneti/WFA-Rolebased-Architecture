import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SidebarItemConfig } from '../config/sidebarConfig';

interface SidebarItemProps {
  item: SidebarItemConfig;
  collapsed?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ item, collapsed }) => {
  const location = useLocation();
  const [subOpen, setSubOpen] = useState(false);
  const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

  if (item.subItems && item.subItems.length > 0 && !collapsed) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setSubOpen(!subOpen)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            isActive
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-3">
            <span className="shrink-0">{item.name}</span>
          </span>
          {subOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        {subOpen && (
          <div className="pl-4 space-y-1 border-l-2 border-slate-800 ml-3 py-1 animate-fadeIn">
            {item.subItems.map((sub, idx) => (
              <NavLink
                key={idx}
                to={sub.path}
                className={({ isActive: subActive }) =>
                  `block px-3 py-1.5 rounded-xl text-[11px] font-medium transition-colors ${
                    subActive
                      ? 'text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                {sub.name}
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
      className={({ isActive: active }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all ${
          active
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
        } ${collapsed ? 'justify-center px-2' : ''}`
      }
      title={collapsed ? item.name : undefined}
    >
      <span className="truncate">{!collapsed && item.name}</span>
    </NavLink>
  );
};
