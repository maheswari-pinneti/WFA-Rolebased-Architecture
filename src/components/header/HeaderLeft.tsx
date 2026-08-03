import React from 'react';
import { SidebarToggle } from './SidebarToggle';
import { Breadcrumbs } from './Breadcrumbs';
import { PageTitle } from './PageTitle';

interface HeaderLeftProps {
  onToggleSidebar: () => void;
}

export const HeaderLeft: React.FC<HeaderLeftProps> = ({ onToggleSidebar }) => {
  return (
    <div className="flex items-center gap-4 shrink-0">
      <SidebarToggle onToggle={onToggleSidebar} />
      <PageTitle />
      <Breadcrumbs />
    </div>
  );
};
