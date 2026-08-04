import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';
import { StacklyLogo } from '../common/StacklyLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[var(--border-color)] bg-[var(--bg-secondary)] py-4 px-6 text-xs text-[var(--text-muted)] font-sans flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <StacklyLogo size={24} showText={true} />
        <span className="text-[11px] font-medium text-slate-400">
          • Enterprise HR Intelligence Platform
        </span>
      </div>

      <div className="flex items-center gap-4 text-[11px] font-mono">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck size={14} /> 256-Bit SSL Encrypted
        </span>
        <span>v2.4 Enterprise</span>
        <span>© {new Date().getFullYear()} STACKLY</span>
      </div>
    </footer>
  );
};
