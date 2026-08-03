import React from 'react';
import { HeaderLeft } from './HeaderLeft';
import { HeaderCenter } from './HeaderCenter';
import { HeaderRight } from './HeaderRight';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="h-[72px] px-6 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/95 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between gap-6 shadow-sm transition-colors">
      <HeaderLeft onToggleSidebar={onToggleSidebar} />
      <HeaderCenter />
      <HeaderRight />
    </header>
  );
};
