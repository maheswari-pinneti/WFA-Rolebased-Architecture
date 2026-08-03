import React from 'react';
import { useTheme } from '../../design-system/theme/theme';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-slate-400 hover:text-[var(--text-primary)] transition-all hover:scale-105"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
    >
      {theme === 'dark' ? (
        <Sun size={20} strokeWidth={2} className="text-[#F59E0B]" />
      ) : (
        <Moon size={20} strokeWidth={2} className="text-[#2563EB]" />
      )}
    </button>
  );
};
