import React from 'react';
import { HeaderActions } from './HeaderActions';

export const HeaderRight: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <HeaderActions />
    </div>
  );
};
