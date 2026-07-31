import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, Users, Activity, Calendar } from 'lucide-react';

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
    <div className="bg-[var(--bg-tertiary)] border-b border-[var(--border-color)] px-4 md:px-6 py-1 flex items-center justify-between gap-2 text-[11px] font-medium text-slate-400">
      {/* Date & Time */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-slate-300">
          <Calendar size={12} className="text-blue-400" />
          <span>{formatDate(now)}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-300 font-mono">
          <Clock size={12} className="text-indigo-400" />
          <span>{formatTime(now)}</span>
        </div>
      </div>

      {/* Status & Active Users */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1">
          <RefreshCw size={11} className="text-slate-400" />
          <span>Updated: Just now</span>
        </div>

        <div className="flex items-center gap-1 text-emerald-400 font-bold">
          <Users size={12} />
          <span>1,180 Active</span>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <Activity size={10} />
          <span className="hidden sm:inline">Live Connection</span>
        </div>
      </div>
    </div>
  );
};
