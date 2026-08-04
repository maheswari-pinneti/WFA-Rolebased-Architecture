import React from 'react';

interface SidebarGroupProps {
  title?: string;
  collapsed?: boolean;
  children: React.ReactNode;
}

export const SidebarGroup: React.FC<SidebarGroupProps> = ({ title, collapsed, children }) => {
  return (
    <div className="space-y-1 py-2">
      {title && !collapsed && (
        <h4 className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
          {title}
        </h4>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
};
