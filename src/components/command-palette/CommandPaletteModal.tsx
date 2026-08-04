import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Search, X, Sparkles, User, FileText, LayoutDashboard, Settings } from 'lucide-react';

export const CommandPaletteModal: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useTheme();
  const [query, setQuery] = useState('');

  if (!isCommandPaletteOpen) return null;

  const quickActions = [
    { title: 'Workforce & Headcount Analytics', category: 'Reports', icon: <FileText size={16} /> },
    { title: 'Employee Directory & Profiles', category: 'Users', icon: <User size={16} /> },
    { title: 'System Security & Role Configuration', category: 'Settings', icon: <Settings size={16} /> },
    { title: 'Executive KPI Dashboard Hub', category: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  ];

  const filtered = quickActions.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-start justify-center pt-24 p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
        {/* Input Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search feature..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400"
          />
          <button onClick={() => setCommandPaletteOpen(false)} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* Results */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Sparkles size={12} className="text-blue-500" /> Command Palette Suggestions
          </div>

          {filtered.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setCommandPaletteOpen(false)}
              className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">{item.title}</p>
                  <p className="text-[10px] text-slate-400">{item.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
