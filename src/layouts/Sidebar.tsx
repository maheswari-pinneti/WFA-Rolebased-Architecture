import React from 'react';
import { sidebarConfig } from '../config/sidebarConfig';
import { SidebarItem } from './SidebarItem';
import { UserProfile } from '../components/sidebar/UserProfile';
import { useAuth } from '../auth/hooks/useAuth';
import { StacklyLogo } from '../components/common/StacklyLogo';
import { accessControl } from '../rbac/accessControl';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const { user, role, permissions } = useAuth();

  const userContext = {
    role: role || 'EMPLOYEE',
    permissions: permissions || [],
  };

  const filteredNavItems = sidebarConfig.filter((item) =>
    accessControl.canAccessMenuItem(userContext, item)
  );

  return (
    <aside
      className={`h-screen sticky top-0 bg-[#0B1120] text-slate-100 border-r border-slate-800/80 flex flex-col justify-between transition-all duration-300 z-30 font-sans ${
        collapsed ? 'w-[80px]' : 'w-[280px]'
      }`}
    >
      {/* Header Section with Brand Logo */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <StacklyLogo size={34} showText={!collapsed} />
      </div>

      {/* User Profile Card below Logo */}
      <UserProfile collapsed={collapsed} />

      {/* Main Navigation Menu Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        {filteredNavItems.map((item) => (
          <SidebarItem key={item.id} item={item} collapsed={collapsed} />
        ))}
      </div>

      {/* Bottom Profile / Settings Footer */}
      <div className="p-3 border-t border-slate-800 text-xs text-slate-400 text-center font-mono">
        {!collapsed && <span>v2.4 Enterprise SaaS</span>}
      </div>
    </aside>
  );
};
