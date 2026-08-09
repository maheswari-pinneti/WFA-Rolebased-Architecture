import React, { useState } from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { History, Search, ShieldAlert, Monitor, Building } from 'lucide-react';

export const AdminAttendanceHistory: React.FC = () => {
  const [records] = useState([
    { id: 'rec-1', name: 'Alex Mercer', role: 'Full Stack Developer', mode: 'Remote', checkIn: '09:02 AM', checkOut: '06:05 PM', status: 'Checked Out' },
    { id: 'rec-2', name: 'Marcus Vance', role: 'Team Lead', mode: 'Office', checkIn: '08:55 AM', checkOut: '05:50 PM', status: 'Checked Out' },
    { id: 'rec-3', name: 'Elena Rostova', role: 'VP of HR', mode: 'Office', checkIn: '09:12 AM', checkOut: '--', status: 'Working' },
    { id: 'rec-4', name: 'Sarah Connor', role: 'System Admin', mode: 'Office', checkIn: '08:45 AM', checkOut: '06:10 PM', status: 'Checked Out' },
    { id: 'rec-5', name: 'David Sterling', role: 'Manager', mode: 'Remote', checkIn: '09:05 AM', checkOut: '--', status: 'Working' },
  ]);

  return (
    <RoleGuard allowedRoles={[Role.ADMIN]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <History size={24} className="text-indigo-400" />
            Attendance History Logs
          </h2>
          <p className="text-sm text-slate-400">Detailed historical audit logs of checking sessions across the enterprise.</p>
        </div>

        <div className="glass-panel p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/40 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Work Mode</th>
                  <th className="py-3 px-4">Check-In</th>
                  <th className="py-3 px-4">Check-Out</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-800/20">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-100">{rec.name}</div>
                      <div className="text-[10px] text-slate-400">{rec.role}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-slate-300">
                        {rec.mode === 'Office' ? <Building size={14} className="text-blue-400" /> : <Monitor size={14} className="text-cyan-400" />}
                        {rec.mode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-200 font-mono">{rec.checkIn}</td>
                    <td className="py-3 px-4 text-slate-200 font-mono">{rec.checkOut}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${rec.status === 'Working' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-500/10 text-slate-400'}`}>
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};
