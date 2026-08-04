import React from 'react';
import { Bell, MessageSquare, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useSecurity } from '../../context/SecurityContext';

export const ActionToolbar: React.FC = () => {
  const { activeTheme, setActiveTheme } = useTheme();
  const { user, role } = useSecurity();

  return (
    <div className="flex items-center gap-3">
      {/* Language Flag */}
      <button
        type="button"
        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm hover:bg-slate-200 transition-colors"
        title="Language: English (UK)"
      >
        🇬🇧
      </button>

      {/* Notifications */}
      <button className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors">
        <Bell size={18} />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center">
          3
        </span>
      </button>

      {/* Chat */}
      <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors">
        <MessageSquare size={18} />
      </button>

      {/* Theme Quick Switch */}
      <button
        onClick={() => setActiveTheme(activeTheme === 'material' ? 'minimal' : 'material')}
        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
        title="Toggle Theme"
      >
        {activeTheme === 'material' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Dynamic Security User Badge */}
      <div className="flex items-center gap-2.5 pl-2 border-l border-slate-300 dark:border-slate-700">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover border-2 border-blue-500 shadow-sm"
        />
        <div className="hidden sm:block text-left">
          <p className="text-xs font-black text-slate-800 dark:text-white leading-none">{user.name}</p>
          <p className="text-[10px] text-amber-500 dark:text-amber-400 font-bold mt-0.5">{role} • {user.title}</p>
        </div>
      </div>
    </div>
  );
};
