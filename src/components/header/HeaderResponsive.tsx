import React from 'react';
import { Search } from 'lucide-react';

interface HeaderResponsiveProps {
  onOpenMobileSearch?: () => void;
}

export const HeaderResponsive: React.FC<HeaderResponsiveProps> = ({ onOpenMobileSearch }) => {
  return (
    <div className="lg:hidden flex items-center">
      <button
        onClick={onOpenMobileSearch}
        aria-label="Open Mobile Search"
        className="p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-slate-400 hover:text-[var(--text-primary)]"
      >
        <Search size={18} />
      </button>
    </div>
  );
};
