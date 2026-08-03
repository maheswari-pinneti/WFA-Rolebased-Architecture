import React from 'react';
import { GlobalSearch } from './GlobalSearch';

export const HeaderCenter: React.FC = () => {
  return (
    <div className="hidden lg:flex items-center justify-center flex-1 max-w-[440px]">
      <GlobalSearch />
    </div>
  );
};
