import React from 'react';
import { useTheme, ThemeType } from '../../context/ThemeContext';
import { Layers, Sparkles } from 'lucide-react';

export const ThemeSelector: React.FC = () => {
  const { activeTheme, setActiveTheme } = useTheme();

  return (
    <div className="fixed top-20 right-6 z-40 bg-slate-900/90 text-white backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-2 text-xs select-none">
      <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider px-1">VIEW THEME:</span>
      
      <button
        onClick={() => setActiveTheme('material')}
        className={`px-3 py-1 rounded-full font-bold transition-all flex items-center gap-1.5 ${
          activeTheme === 'material'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <Layers size={13} />
        <span>Material Dashboard 2</span>
      </button>

      <button
        onClick={() => setActiveTheme('minimal')}
        className={`px-3 py-1 rounded-full font-bold transition-all flex items-center gap-1.5 ${
          activeTheme === 'minimal'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <Sparkles size={13} />
        <span>Minimal Kit UI</span>
      </button>
    </div>
  );
};
