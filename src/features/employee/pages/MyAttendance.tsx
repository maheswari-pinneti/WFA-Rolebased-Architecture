import React from 'react';
import { LiveCheckInWidget } from '../../../components/attendance/LiveCheckInWidget';
import { AttendanceCalendarView } from '../../../components/attendance/AttendanceCalendarView';
import { AttendanceChart } from '../../analytics/charts/AttendanceChart';

export const MyAttendance: React.FC = () => {
  const history = [
    { date: 'Aug 4, 2026', in: '09:00 AM', out: '06:00 PM', hours: '09h 00m', mode: 'OFFICE', status: 'PRESENT' },
    { date: 'Aug 3, 2026', in: '08:55 AM', out: '06:15 PM', hours: '09h 20m', mode: 'OFFICE', status: 'PRESENT' },
    { date: 'Aug 2, 2026', in: '--', out: '--', hours: '00h 00m', mode: 'WEEKEND', status: 'WEEKEND' },
    { date: 'Aug 1, 2026', in: '--', out: '--', hours: '00h 00m', mode: 'WEEKEND', status: 'WEEKEND' },
    { date: 'Jul 31, 2026', in: '09:05 AM', out: '05:45 PM', hours: '08h 40m', mode: 'REMOTE', status: 'PRESENT' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn font-sans pb-10">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">My Personal Attendance & Shift Tracker</h2>
        <p className="text-xs text-slate-400 mt-1">Review live check-in timestamps, total hours in office, break times, and monthly calendar history.</p>
      </div>

      {/* Live Check-In / Check-Out Widget */}
      <LiveCheckInWidget employeeName="Alex Mercer" department="Engineering & Technology" />

      {/* Monthly Attendance Calendar */}
      <AttendanceCalendarView />

      {/* Analytics Chart */}
      <AttendanceChart />

      {/* Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
        <h3 className="text-base font-extrabold text-white">Recent Daily Punch Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Clock In</th>
                <th className="py-3 px-4">Clock Out</th>
                <th className="py-3 px-4">Total Office Hours</th>
                <th className="py-3 px-4">Work Mode</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {history.map((h, i) => (
                <tr key={i} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white">{h.date}</td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{h.in}</td>
                  <td className="py-3 px-4 font-mono text-rose-400 font-bold">{h.out}</td>
                  <td className="py-3 px-4 font-mono text-blue-400 font-bold">{h.hours}</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">{h.mode}</span></td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      h.status === 'PRESENT' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
