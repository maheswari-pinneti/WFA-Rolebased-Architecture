import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, Calendar, Activity } from 'lucide-react';

export const InformationBar: React.FC = () => {
  const [now, setNow] = useState(new Date());

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

  return (
    <div className="bg-[var(--bg-tertiary)] border-b border-[var(--border-color)] px-6 py-1.5 flex items-center justify-between gap-4 text-xs font-medium text-slate-400">
      {/* Current Date & Current Time */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Calendar size={13} className="text-[#2563EB]" />
          <span>{formatDate(now)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300 font-mono">
          <Clock size={13} className="text-[#4F46E5]" />
          <span>{formatTime(now)}</span>
        </div>
      </div>

      {/* Last Updated & Online Status */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5">
          <RefreshCw size={12} className="text-slate-400" />
          <span>Last Updated: Just now</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[#22C55E] font-bold text-[11px]">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
          <Activity size={12} />
          <span>Online • 99.98% System Health</span>
        </div>
      </div>
    </div>
  );
};
