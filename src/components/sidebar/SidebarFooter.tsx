import React from 'react';
import { LifeBuoy } from 'lucide-react';

interface SidebarFooterProps {
  collapsed?: boolean;
  onOpenSupport: () => void;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ collapsed, onOpenSupport }) => {
  return (
    <div className="p-2.5 border-t border-[var(--border-color)] w-full shrink-0">
      <button
        onClick={onOpenSupport}
        title="Company Help & Support"
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left bg-gradient-to-r from-blue-600/10 to-indigo-600/10 hover:from-blue-600/20 hover:to-indigo-600/20 border border-blue-500/30 text-blue-500 transition-all group relative ${
          collapsed ? 'justify-center px-0' : ''
        }`}
      >
        <LifeBuoy size={20} strokeWidth={2} className="shrink-0 transition-transform group-hover:rotate-45 duration-300" />
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="font-bold text-xs">Help & Support</div>
            <div className="text-[10px] text-slate-400 truncate">24/7 Enterprise IT Desk</div>
          </div>
        )}
        {collapsed && (
          <span className="absolute left-16 px-3 py-1.5 text-xs font-bold rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 whitespace-nowrap">
            Help & Support
          </span>
        )}
      </button>
    </div>
  );
};
