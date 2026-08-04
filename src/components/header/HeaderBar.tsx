import React from 'react';
import { Search, ChevronRight, Home, Layers } from 'lucide-react';
import { ActionToolbar } from './ActionToolbar';
import { useTheme } from '../../context/ThemeContext';

export const HeaderBar: React.FC = () => {
  const { setCommandPaletteOpen } = useTheme();

  return (
    <header className="h-16 px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-30 shrink-0 shadow-sm">
      {/* Left Section: Logo & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 font-black text-lg text-slate-900 dark:text-white">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md">
            S
          </div>
          <span>STACKLY</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 pl-4 border-l border-slate-200 dark:border-slate-800">
          <Home size={14} className="text-slate-400" />
          <ChevronRight size={12} className="text-slate-400" />
          <span>Admin</span>
          <ChevronRight size={12} className="text-slate-400" />
          <span className="font-bold text-blue-600 dark:text-blue-400">Dashboard</span>
        </div>
      </div>

      {/* Center Section: Omni Search Bar (Ctrl+K) */}
      <div
        onClick={() => setCommandPaletteOpen(true)}
        className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-400 hover:border-blue-500 cursor-pointer w-72 transition-colors"
      >
        <Search size={15} />
        <span className="flex-1">Search features, employees (Ctrl+K)...</span>
        <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-500">
          ⌘K
        </kbd>
      </div>

      {/* Right Section: Action Toolbar */}
      <ActionToolbar />
    </header>
  );
};
