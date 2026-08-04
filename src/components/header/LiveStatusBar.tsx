import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useSecurity } from '../../context/SecurityContext';
import { Calendar, Clock, Building2, RefreshCw, Activity } from 'lucide-react';

export const LiveStatusBar: React.FC = () => {
  const { currentTime } = useTheme();
  const { deptScope } = useSecurity();

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-slate-900 text-slate-300 text-xs px-6 py-2 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 shrink-0 select-none">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 font-bold text-white">
          <Calendar size={14} className="text-blue-400" />
          <span>{currentDate}</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-slate-200 pl-4 border-l border-slate-800">
          <Clock size={14} className="text-blue-400" />
          <span>{currentTime.split(' ').slice(-2).join(' ') || '11:53:44 PM'}</span>
        </div>

        <div className="flex items-center gap-1.5 font-semibold text-blue-300 pl-4 border-l border-slate-800">
          <Building2 size={14} className="text-blue-400" />
          <span>Dept Scope: <strong className="text-white font-bold">{deptScope}</strong></span>
        </div>
      </div>

      <div className="flex items-center gap-6 text-[11px]">
        <div className="flex items-center gap-1.5 font-mono">
          <RefreshCw size={12} className="text-emerald-400 animate-spin" />
          <span>Sync: <strong className="text-emerald-400 font-bold">Realtime</strong></span>
        </div>

        <div className="flex items-center gap-1.5 font-mono">
          <Activity size={13} className="text-blue-400" />
          <span>Health: <strong className="text-white font-bold bg-blue-500/20 px-2 py-0.5 rounded-md border border-blue-500/30">99.98% SLA</strong></span>
        </div>
      </div>
    </div>
  );
};
