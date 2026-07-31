import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  label?: string;
}

export const Loader: React.FC<LoaderProps> = ({ label = 'Loading analytics data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
      <Loader2 size={36} className="animate-spin text-indigo-500 mb-3" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
};
