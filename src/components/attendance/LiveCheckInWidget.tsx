import React, { useState, useEffect } from 'react';
import { Clock, Play, Square, Coffee, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

interface LiveCheckInWidgetProps {
  employeeName?: string;
  department?: string;
}

export const LiveCheckInWidget: React.FC<LiveCheckInWidgetProps> = ({
  employeeName = 'Alex Mercer',
  department = 'Engineering & Technology',
}) => {
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState<string>('09:00 AM');
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [workMode, setWorkMode] = useState<'Office' | 'Remote' | 'Client'>('Office');
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakSeconds, setBreakSeconds] = useState(2700); // 45 mins default
  const [timerSeconds, setTimerSeconds] = useState(27900); // 7h 45m
  const [now, setNow] = useState(new Date());

  // Real-time Clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Office Timer
  useEffect(() => {
    let interval: any;
    if (isCheckedIn && !isOnBreak) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn, isOnBreak]);

  // Break Timer
  useEffect(() => {
    let interval: any;
    if (isOnBreak) {
      interval = setInterval(() => {
        setBreakSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOnBreak]);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  const handleToggleCheckIn = () => {
    const currentTimeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    if (isCheckedIn) {
      setIsCheckedIn(false);
      setCheckOutTime(currentTimeStr);
      setIsOnBreak(false);
    } else {
      setIsCheckedIn(true);
      setCheckInTime(currentTimeStr);
      setCheckOutTime(null);
    }
  };

  const handleToggleBreak = () => {
    if (!isCheckedIn) return;
    setIsOnBreak((prev) => !prev);
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 text-slate-100 font-sans">
      {/* Header with Digital Clock & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-white">Live Attendance & Time Tracker</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
              isCheckedIn
                ? isOnBreak
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {isCheckedIn ? (isOnBreak ? '● ON BREAK' : '● CLOCKED IN (ACTIVE)') : '○ CLOCKED OUT'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {employeeName} • {department}
          </p>
        </div>

        {/* Live Digital Clock */}
        <div className="text-left sm:text-right font-mono">
          <p className="text-xl font-black text-blue-400">
            {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
          </p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Main Metrics Row: Check In, Check Out, Office Hours, Break Time */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
          <p className="text-[10px] font-extrabold uppercase text-slate-400">Check-In Time</p>
          <p className="text-base font-black text-emerald-400 font-mono">{checkInTime}</p>
          <p className="text-[9.5px] text-slate-500">Scheduled: 09:00 AM</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
          <p className="text-[10px] font-extrabold uppercase text-slate-400">Check-Out Time</p>
          <p className="text-base font-black text-rose-400 font-mono">{checkOutTime || '--:-- --'}</p>
          <p className="text-[9.5px] text-slate-500">Scheduled: 06:00 PM</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
          <p className="text-[10px] font-extrabold uppercase text-slate-400">Hours in Office</p>
          <p className="text-base font-black text-blue-400 font-mono">{formatTimer(timerSeconds)}</p>
          <p className="text-[9.5px] text-slate-500">Target: 08h 00m</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
          <p className="text-[10px] font-extrabold uppercase text-slate-400">Break Duration</p>
          <p className="text-base font-black text-amber-400 font-mono">{formatTimer(breakSeconds)}</p>
          <p className="text-[9.5px] text-slate-500">Max Allowed: 01h 00m</p>
        </div>
      </div>

      {/* Action Controls & Work Mode Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-slate-800">
        {/* Work Mode Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <MapPin size={14} className="text-blue-400" /> Mode:
          </span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['Office', 'Remote', 'Client'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setWorkMode(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  workMode === mode
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode === 'Office' ? 'In-Office' : mode === 'Remote' ? 'Remote WFH' : 'Client Site'}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons: Check In / Out Toggle & Break Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleBreak}
            disabled={!isCheckedIn}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-40 ${
              isOnBreak
                ? 'bg-amber-600 hover:bg-amber-500 border-amber-500 text-white shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
          >
            <Coffee size={15} /> {isOnBreak ? 'Resume Work' : 'Take Break'}
          </button>

          <button
            onClick={handleToggleCheckIn}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold text-white shadow-lg transition-all flex items-center gap-2 ${
              isCheckedIn
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
            }`}
          >
            {isCheckedIn ? (
              <>
                <Square size={15} /> Check Out
              </>
            ) : (
              <>
                <Play size={15} /> Check In Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
