import React from 'react';
import { Search, X } from 'lucide-react';

export interface AdvancedFilterBarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onFilterChange?: (filter: any) => void;
  placeholder?: string;
  onClear?: () => void;
  children?: React.ReactNode;
}

export const AdvancedFilterBar: React.FC<AdvancedFilterBarProps> = ({
  searchQuery = '',
  onSearchChange,
  onFilterChange,
  placeholder = 'Filter records...',
  onClear,
  children,
}) => {
  return (
    <div className="glass-panel p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
        />
        {searchQuery && onClear && (
          <button
            onClick={onClear}
            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
};
