import React from 'react';

interface LogoProps {
  collapsed?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ collapsed }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
        W
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="font-extrabold text-sm tracking-tight text-[var(--text-primary)] leading-tight uppercase">
            Workforce
          </span>
          <span className="text-[10px] font-bold text-blue-500 tracking-wider uppercase">
            Analytics Dashboard
          </span>
        </div>
      )}
    </div>
  );
};
