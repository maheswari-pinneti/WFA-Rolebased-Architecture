import React from 'react';
import { Logo } from './Logo';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile?: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  collapsed,
  onToggleCollapse,
  onCloseMobile,
}) => {
  return (
    <div className="h-[72px] px-4 border-b border-[var(--border-color)] flex items-center justify-between shrink-0">
      <Logo collapsed={collapsed} />

      <div className="flex items-center gap-1">
        {/* Desktop Collapse Button */}
        <button
          onClick={onToggleCollapse}
          aria-label="Collapse Sidebar"
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            aria-label="Close Mobile Sidebar"
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
