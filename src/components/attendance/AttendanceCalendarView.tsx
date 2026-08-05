import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react';

export interface AttendanceDayRecord {
  day: number;
  dateStr: string;
  status: 'PRESENT' | 'REMOTE' | 'HALF_DAY' | 'LEAVE' | 'ABSENT' | 'WEEKEND';
  checkIn: string;
  checkOut: string;
  hoursWorked: string;
  breakDuration: string;
  ipAddress: string;
  location: string;
}

export const AttendanceCalendarView: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<AttendanceDayRecord | null>(null);

  // August 2026 Mock Calendar Records (31 Days)
  const calendarRecords: AttendanceDayRecord[] = [
    { day: 1, dateStr: 'Aug 1, 2026', status: 'WEEKEND', checkIn: '--', checkOut: '--', hoursWorked: '0h 00m', breakDuration: '0m', ipAddress: '--', location: 'Weekend' },
    { day: 2, dateStr: 'Aug 2, 2026', status: 'WEEKEND', checkIn: '--', checkOut: '--', hoursWorked: '0h 00m', breakDuration: '0m', ipAddress: '--', location: 'Weekend' },
    { day: 3, dateStr: 'Aug 3, 2026', status: 'PRESENT', checkIn: '08:55 AM', checkOut: '06:15 PM', hoursWorked: '09h 20m', breakDuration: '45m', ipAddress: '192.168.1.45', location: 'Office HQ (Floor 4)' },
    { day: 4, dateStr: 'Aug 4, 2026', status: 'PRESENT', checkIn: '09:00 AM', checkOut: '06:00 PM', hoursWorked: '09h 00m', breakDuration: '45m', ipAddress: '192.168.1.45', location: 'Office HQ (Floor 4)' },
    { day: 5, dateStr: 'Aug 5, 2026', status: 'REMOTE', checkIn: '09:15 AM', checkOut: '05:45 PM', hoursWorked: '08h 30m', breakDuration: '30m', ipAddress: '10.0.0.12', location: 'Remote WFH (Seattle)' },
    { day: 6, dateStr: 'Aug 6, 2026', status: 'PRESENT', checkIn: '08:50 AM', checkOut: '06:10 PM', hoursWorked: '09h 20m', breakDuration: '50m', ipAddress: '192.168.1.45', location: 'Office HQ (Floor 4)' },
    { day: 7, dateStr: 'Aug 7, 2026', status: 'HALF_DAY', checkIn: '09:00 AM', checkOut: '01:30 PM', hoursWorked: '04h 30m', breakDuration: '15m', ipAddress: '192.168.1.45', location: 'Office HQ (Floor 4)' },
    { day: 8, dateStr: 'Aug 8, 2026', status: 'WEEKEND', checkIn: '--', checkOut: '--', hoursWorked: '0h 00m', breakDuration: '0m', ipAddress: '--', location: 'Weekend' },
    { day: 9, dateStr: 'Aug 9, 2026', status: 'WEEKEND', checkIn: '--', checkOut: '--', hoursWorked: '0h 00m', breakDuration: '0m', ipAddress: '--', location: 'Weekend' },
    { day: 10, dateStr: 'Aug 10, 2026', status: 'PRESENT', checkIn: '08:58 AM', checkOut: '06:02 PM', hoursWorked: '09h 04m', breakDuration: '45m', ipAddress: '192.168.1.45', location: 'Office HQ (Floor 4)' },
    { day: 11, dateStr: 'Aug 11, 2026', status: 'LEAVE', checkIn: '--', checkOut: '--', hoursWorked: '0h 00m', breakDuration: '0m', ipAddress: '--', location: 'Approved Sick Leave' },
    { day: 12, dateStr: 'Aug 12, 2026', status: 'PRESENT', checkIn: '09:05 AM', checkOut: '06:15 PM', hoursWorked: '09h 10m', breakDuration: '45m', ipAddress: '192.168.1.45', location: 'Office HQ (Floor 4)' },
    { day: 13, dateStr: 'Aug 13, 2026', status: 'REMOTE', checkIn: '09:00 AM', checkOut: '06:00 PM', hoursWorked: '09h 00m', breakDuration: '45m', ipAddress: '10.0.0.12', location: 'Remote WFH (Seattle)' },
    { day: 14, dateStr: 'Aug 14, 2026', status: 'PRESENT', checkIn: '08:52 AM', checkOut: '06:05 PM', hoursWorked: '09h 13m', breakDuration: '50m', ipAddress: '192.168.1.45', location: 'Office HQ (Floor 4)' },
    { day: 15, dateStr: 'Aug 15, 2026', status: 'WEEKEND', checkIn: '--', checkOut: '--', hoursWorked: '0h 00m', breakDuration: '0m', ipAddress: '--', location: 'Weekend' },
    { day: 16, dateStr: 'Aug 16, 2026', status: 'WEEKEND', checkIn: '--', checkOut: '--', hoursWorked: '0h 00m', breakDuration: '0m', ipAddress: '--', location: 'Weekend' },
    { day: 17, dateStr: 'Aug 17, 2026', status: 'PRESENT', checkIn: '09:00 AM', checkOut: '06:10 PM', hoursWorked: '09h 10m', breakDuration: '45m', ipAddress: '192.168.1.45', location: 'Office HQ (Floor 4)' },
    { day: 18, dateStr: 'Aug 18, 2026', status: 'PRESENT', checkIn: '08:55 AM', checkOut: '06:00 PM', hoursWorked: '09h 05m', breakDuration: '40m', ipAddress: '192.168.1.45', location: 'Office HQ (Floor 4)' },
    { day: 19, dateStr: 'Aug 19, 2026', status: 'REMOTE', checkIn: '09:10 AM', checkOut: '06:00 PM', hoursWorked: '08h 50m', breakDuration: '30m', ipAddress: '10.0.0.12', location: 'Remote WFH (Seattle)' },
    { day: 20, dateStr: 'Aug 20, 2026', status: 'PRESENT', checkIn: '08:50 AM', checkOut: '06:20 PM', hoursWorked: '09h 30m', breakDuration: '55m', ipAddress: '192.168.1.45', location: 'Office HQ (Floor 4)' },
    { day: 21, dateStr: 'Aug 21, 2026', status: 'PRESENT', checkIn: '09:00 AM', checkOut: '06:00 PM', hoursWorked: '09h 00m', breakDuration: '45m', ipAddress: '192.168.1.45', location: 'Office HQ (Floor 4)' },
    { day: 22, dateStr: 'Aug 22, 2026', status: 'WEEKEND', checkIn: '--', checkOut: '--', hoursWorked: '0h 00m', breakDuration: '0m', ipAddress: '--', location: 'Weekend' },
    { day: 23, dateStr: 'Aug 23, 2026', status: 'WEEKEND', checkIn: '--', checkOut: '--', hoursWorked: '0h 00m', breakDuration: '0m', ipAddress: '--', location: 'Weekend' },
    { day: 24, dateStr: 'Aug 24, 2026', status: 'PRESENT', checkIn: '08:58 AM', checkOut: '06:15 PM', hoursWorked: '09h 17m', breakDuration: '45m', ipAddress: '192.168.1.45', location: 'Office HQ (Floor 4)' },
    { day: 25, dateStr: 'Aug 25, 2026', status: 'PRESENT', checkIn: '09:00 AM', checkOut: '06:00 PM', hoursWorked: '09h 00m', breakDuration: '45m', ipAddress: '192.168.1.45', location: 'Office HQ (Floor 4)' },
    { day: 26, dateStr: 'Aug 26, 2026', status: 'PRESENT', checkIn: '08:45 AM', checkOut: '06:30 PM', hoursWorked: '09h 45m', breakDuration: '60m', ipAddress: '192.168.1.45', location: 'Office HQ (Floor 4)' },
    { day: 27, dateStr: 'Aug 27, 2026', status: 'REMOTE', checkIn: '09:05 AM', checkOut: '05:50 PM', hoursWorked: '08h 45m', breakDuration: '30m', ipAddress: '10.0.0.12', location: 'Remote WFH (Seattle)' },
    { day: 28, dateStr: 'Aug 28, 2026', status: 'PRESENT', checkIn: '08:50 AM', checkOut: '06:10 PM', hoursWorked: '09h 20m', breakDuration: '45m', ipAddress: '192.168.1.45', location: 'Office HQ (Floor 4)' },
    { day: 29, dateStr: 'Aug 29, 2026', status: 'WEEKEND', checkIn: '--', checkOut: '--', hoursWorked: '0h 00m', breakDuration: '0m', ipAddress: '--', location: 'Weekend' },
    { day: 30, dateStr: 'Aug 30, 2026', status: 'WEEKEND', checkIn: '--', checkOut: '--', hoursWorked: '0h 00m', breakDuration: '0m', ipAddress: '--', location: 'Weekend' },
    { day: 31, dateStr: 'Aug 31, 2026', status: 'PRESENT', checkIn: '09:00 AM', checkOut: '06:00 PM', hoursWorked: '09h 00m', breakDuration: '45m', ipAddress: '192.168.1.45', location: 'Office HQ (Floor 4)' },
  ];

  const trackedDays = calendarRecords.filter((item) => item.status !== 'WEEKEND');
  const officeDays = calendarRecords.filter((item) => item.status === 'PRESENT').length;
  const remoteDays = calendarRecords.filter((item) => item.status === 'REMOTE').length;
  const leaveDays = calendarRecords.filter((item) => item.status === 'LEAVE').length;
  const workedDays = calendarRecords.filter((item) => ['PRESENT', 'REMOTE', 'HALF_DAY'].includes(item.status)).length;
  const attendanceRate = Math.round((workedDays / trackedDays.length) * 100);

  const getStatusBadge = (status: AttendanceDayRecord['status']) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'REMOTE':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'HALF_DAY':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'LEAVE':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'ABSENT':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="calendar-card p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 text-slate-100 font-sans">
      {/* Calendar Header */}
      <div className="calendar-header flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="calendar-title text-lg font-black text-white flex items-center gap-2">
            <span className="calendar-title-icon"><CalendarIcon size={18} /></span>
            Monthly Attendance Calendar
          </h3>
          <p className="calendar-subtitle text-xs text-slate-400 mt-0.5">
            A quick view of your August attendance, location, and work hours.
          </p>
        </div>

        <div className="calendar-toolbar flex items-center gap-2">
          <button type="button" aria-label="Previous month" className="calendar-nav-button p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">
            <ChevronLeft size={16} />
          </button>
          <span className="calendar-month-label text-xs font-black font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            August 2026
          </span>
          <button type="button" aria-label="Next month" className="calendar-nav-button p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="calendar-summary-grid">
        <div className="calendar-summary-card calendar-summary-card--present">
          <span className="calendar-summary-label">In office</span>
          <strong>{officeDays} days</strong>
          <small>Primary work location</small>
        </div>
        <div className="calendar-summary-card calendar-summary-card--remote">
          <span className="calendar-summary-label">Remote</span>
          <strong>{remoteDays} days</strong>
          <small>Approved WFH sessions</small>
        </div>
        <div className="calendar-summary-card calendar-summary-card--leave">
          <span className="calendar-summary-label">Time off</span>
          <strong>{leaveDays} day</strong>
          <small>Approved leave</small>
        </div>
        <div className="calendar-summary-card calendar-summary-card--rate">
          <span className="calendar-summary-label">Attendance</span>
          <strong>{attendanceRate}%</strong>
          <small>{workedDays} of {trackedDays.length} working days</small>
        </div>
      </div>

      {/* Status Legend Pills */}
      <div className="calendar-legend flex flex-wrap items-center gap-2 text-[11px] font-bold">
        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">● Present (In-Office)</span>
        <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">● Remote WFH</span>
        <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">● Half-Day</span>
        <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">● Approved Leave</span>
        <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">● Absent</span>
        <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 border border-slate-700">● Weekend</span>
      </div>

      {/* Calendar Weekday Names */}
      <div className="calendar-weekdays grid grid-cols-7 gap-2 text-center text-[11px] font-extrabold uppercase text-slate-400 pt-2">
        <span>Sat</span>
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
      </div>

      {/* 31-Day Calendar Tiles Grid */}
      <div className="calendar-grid grid grid-cols-7 gap-2">
        {calendarRecords.map((item) => (
          <div
            key={item.day}
            onClick={() => setSelectedDay(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') setSelectedDay(item);
            }}
            className={`calendar-day calendar-day--${item.status.toLowerCase()} p-2.5 rounded-2xl border transition-all cursor-pointer hover:scale-105 flex flex-col justify-between min-h-[75px] ${getStatusBadge(item.status)}`}
          >
            <div className="calendar-day-top flex items-center justify-between">
              <span className="calendar-day-number text-xs font-black font-mono">{item.day}</span>
              <span className="calendar-day-dot" aria-hidden="true" />
            </div>

            <span className="calendar-day-status text-[9px] font-bold uppercase">{item.status.replace('_', ' ')}</span>

            {item.status !== 'WEEKEND' && item.status !== 'LEAVE' ? (
              <div className="calendar-day-meta space-y-0.5 text-[9.5px] font-mono">
                <p className="truncate font-bold text-white">{item.hoursWorked}</p>
                <p className="truncate opacity-75">In {item.checkIn}</p>
              </div>
            ) : (
              <p className="calendar-day-meta text-[9.5px] font-mono opacity-60">{item.status === 'LEAVE' ? 'Approved' : 'Rest day'}</p>
            )}
          </div>
        ))}
      </div>

      {/* Detailed Day Hover/Click Modal Dialog */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-3xl shadow-2xl space-y-5 text-slate-100 relative">
            <button
              onClick={() => setSelectedDay(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black font-mono border border-blue-500/30">
                {selectedDay.day}
              </div>
              <div>
                <h4 className="text-base font-extrabold text-white">{selectedDay.dateStr}</h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(selectedDay.status)}`}>
                  {selectedDay.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase">Check-In Time</p>
                  <p className="text-sm font-black font-mono text-emerald-400 mt-0.5">{selectedDay.checkIn}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase">Check-Out Time</p>
                  <p className="text-sm font-black font-mono text-rose-400 mt-0.5">{selectedDay.checkOut}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase">Total Hours Worked</p>
                  <p className="text-sm font-black font-mono text-blue-400 mt-0.5">{selectedDay.hoursWorked}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase">Break Duration</p>
                  <p className="text-sm font-black font-mono text-amber-400 mt-0.5">{selectedDay.breakDuration}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase">Work Location & IP</p>
                <p className="font-bold text-white flex items-center gap-1.5">
                  <MapPin size={14} className="text-blue-400" /> {selectedDay.location}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">IP: {selectedDay.ipAddress}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedDay(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Close Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
