import React from 'react';

interface MenuGroupProps {
  title?: string;
  collapsed?: boolean;
  children: React.ReactNode;
}

export const MenuGroup: React.FC<MenuGroupProps> = ({ title, collapsed, children }) => {
  return (
    <div className="space-y-1 py-1.5 font-sans">
      {title && !collapsed && (
        <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
          {title}
        </div>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
};
