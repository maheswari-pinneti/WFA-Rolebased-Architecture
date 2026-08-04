import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, Calendar, Activity } from 'lucide-react';
import { useTheme } from '../../../design-system/theme/theme';

export const InformationBar: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const isDark = theme === 'dark';

  return (
    <div className={`px-4 py-1 flex items-center justify-between gap-4 text-[11px] font-medium transition-colors border-b ${
      isDark ? 'bg-[#0B1120]/90 border-slate-800/80 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
    }`}>
      {/* Current Date & Current Time */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Calendar size={12} className="text-blue-400" />
          <span className="font-semibold">{formatDate(now)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300 font-mono">
          <Clock size={12} className="text-indigo-400" />
          <span>{formatTime(now)}</span>
        </div>
      </div>

      {/* System Status & Last Sync */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1 text-slate-400">
          <RefreshCw size={11} className="text-slate-500" />
          <span>Sync: Realtime</span>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <Activity size={11} />
          <span>99.98% System Health</span>
        </div>
      </div>
    </div>
  );
};
