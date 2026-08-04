import React, { useState } from 'react';
import { SidebarHeader } from './SidebarHeader';
import { UserProfile } from './UserProfile';
import { SidebarMenu } from './SidebarMenu';
import { SidebarFooter } from './SidebarFooter';
import { Search, X } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onOpenSupport: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  onOpenSupport,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Container (Desktop Fixed + Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen bg-[var(--bg-secondary)] border-r border-[var(--border-color)] z-50 flex flex-col transition-all duration-300 shadow-xl ${
          collapsed ? 'w-[64px]' : 'w-[220px]'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* 1. Brand Section (Header & Logo) */}
        <SidebarHeader
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((prev) => !prev)}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* 2. User Profile Section */}
        <UserProfile collapsed={collapsed} />

        {/* 3. Quick Navigation Filter Search Input */}
        {!collapsed && (
          <div className="px-3 pt-3 pb-1">
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-3 text-slate-400 pointer-events-none z-10" />
              <input
                type="text"
                placeholder="Filter links..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] rounded-xl pl-8 pr-7 py-1.5 focus:outline-none focus:border-blue-500 transition-colors"
              />
              {filterQuery && (
                <button
                  onClick={() => setFilterQuery('')}
                  className="absolute right-2 text-slate-400 hover:text-slate-200 p-0.5 rounded"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* 4. Role-Based Sidebar Navigation Menu */}
        <SidebarMenu
          collapsed={collapsed}
          filterQuery={filterQuery}
          onSelectMenuItem={() => setMobileOpen(false)}
        />

        {/* 5. Sidebar Footer Help & Support */}
        <SidebarFooter collapsed={collapsed} onOpenSupport={onOpenSupport} />
      </aside>
    </>
  );
};
