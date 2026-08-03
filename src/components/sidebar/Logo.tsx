import React from 'react';
import { StacklyLogo } from '../common/StacklyLogo';

interface LogoProps {
  collapsed?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ collapsed }) => {
  return (
    <div className="flex items-center gap-3">
      <StacklyLogo size={32} showText={false} />
      {!collapsed && (
        <div className="flex flex-col min-w-0">
          <span className="font-extrabold text-sm tracking-tight text-[var(--text-primary)] leading-tight uppercase truncate font-sans">
            Stackly
          </span>
          <span className="text-[10.5px] font-bold text-blue-500 tracking-tight leading-none uppercase truncate">
            Workforce Analytics
          </span>
          <span className="text-[9px] font-medium text-slate-400 leading-none mt-0.5 truncate">
            Workforce Intelligence Platform
          </span>
        </div>
      )}
    </div>
  );
};
