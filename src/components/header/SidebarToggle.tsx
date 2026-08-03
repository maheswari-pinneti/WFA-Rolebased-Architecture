import React from 'react';
import { Menu } from 'lucide-react';

interface SidebarToggleProps {
  onToggle: () => void;
}

export const SidebarToggle: React.FC<SidebarToggleProps> = ({ onToggle }) => {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle Sidebar Navigation"
      className="p-2 rounded-xl text-slate-400 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all hover:scale-105 border border-transparent hover:border-[var(--border-color)]"
      title="Toggle Navigation Sidebar"
    >
      <Menu size={22} strokeWidth={2} />
    </button>
  );
};
