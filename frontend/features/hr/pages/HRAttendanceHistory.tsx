import React, { useState } from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { History, Shield, Building, Monitor } from 'lucide-react';

export const HRAttendanceHistory: React.FC = () => {
  const [logs] = useState([
    { id: 'log-1', employee: 'Alex Mercer', mode: 'Remote', checkIn: '2026-08-09T09:02:00Z', checkOut: '2026-08-09T18:05:00Z' },
    { id: 'log-2', employee: 'Marcus Vance', mode: 'Office', checkIn: '2026-08-09T08:55:00Z', checkOut: '2026-08-09T17:50:00Z' },
  ]);

  return (
    <RoleGuard allowedRoles={[Role.HR, Role.ADMIN]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <History size={24} className="text-indigo-400" />
            Attendance History Archives
          </h2>
          <p className="text-sm text-slate-400">Review historic clock records and work mode allocations.</p>
        </div>

        <div className="glass-panel p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/40 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Workplace Mode</th>
                  <th className="py-3 px-4">Check-In</th>
                  <th className="py-3 px-4">Check-Out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/20">
                    <td className="py-3 px-4 font-bold text-slate-100">{log.employee}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 text-slate-300">
                        {log.mode === 'Office' ? <Building size={14} className="text-blue-400" /> : <Monitor size={14} className="text-cyan-400" />}
                        {log.mode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-200 font-mono text-xs">{new Date(log.checkIn).toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-200 font-mono text-xs">{new Date(log.checkOut).toLocaleString()}</td>
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
