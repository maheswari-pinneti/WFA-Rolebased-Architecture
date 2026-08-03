import React from 'react';
import { NotificationMenu } from './NotificationMenu';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { UserProfileMenu } from './UserProfileMenu';

export const HeaderActions: React.FC = () => {
  return (
    <div className="flex items-center gap-3 shrink-0">
      <NotificationMenu />
      <ThemeToggle />
      <LanguageSelector />
      <UserProfileMenu />
    </div>
  );
};
