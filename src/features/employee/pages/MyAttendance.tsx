import React from 'react';
import { AttendanceChart } from '../../analytics/charts/AttendanceChart';

export const MyAttendance: React.FC = () => {
  const history = [
    { date: 'Jul 31, 2026', in: '08:58 AM', out: 'In Progress', hours: '6.5', mode: 'OFFICE', status: 'PRESENT' },
    { date: 'Jul 30, 2026', in: '09:00 AM', out: '05:30 PM', hours: '8.5', mode: 'OFFICE', status: 'PRESENT' },
    { date: 'Jul 29, 2026', in: '09:05 AM', out: '05:32 PM', hours: '8.4', mode: 'REMOTE', status: 'PRESENT' },
    { date: 'Jul 28, 2026', in: '08:55 AM', out: '05:25 PM', hours: '8.5', mode: 'OFFICE', status: 'PRESENT' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">My Personal Attendance History</h2>
        <p className="text-sm text-slate-400">Review monthly punch logs and overtime records</p>
      </div>

      <AttendanceChart />

      <div className="glass-panel p-6">
        <h3 className="text-base font-bold mb-4">Recent Punch Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/40 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Clock In</th>
                <th className="py-3 px-4">Clock Out</th>
                <th className="py-3 px-4">Total Hours</th>
                <th className="py-3 px-4">Work Mode</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {history.map((h, i) => (
                <tr key={i} className="hover:bg-slate-800/20">
                  <td className="py-3 px-4 font-bold">{h.date}</td>
                  <td className="py-3 px-4 font-mono text-xs text-indigo-400">{h.in}</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-400">{h.out}</td>
                  <td className="py-3 px-4 font-semibold">{h.hours} hrs</td>
                  <td className="py-3 px-4"><span className="badge badge-info">{h.mode}</span></td>
                  <td className="py-3 px-4"><span className="badge badge-success">{h.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
