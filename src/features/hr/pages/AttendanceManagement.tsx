import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';
import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

export const AttendanceManagement: React.FC = () => {
  const attendanceLogs = [
    { id: '1', emp: 'Alex Mercer', code: 'WFA-1005', inTime: '08:58 AM', outTime: '---', mode: 'OFFICE', status: 'PRESENT' },
    { id: '2', emp: 'Marcus Vance', code: 'WFA-1004', inTime: '09:12 AM', outTime: '---', mode: 'REMOTE', status: 'LATE' },
    { id: '3', emp: 'Chloe Bennett', code: 'WFA-1006', inTime: '---', outTime: '---', mode: 'REMOTE', status: 'ON_LEAVE' },
    { id: '4', emp: 'Liam Thorne', code: 'WFA-1007', inTime: '09:01 AM', outTime: '05:30 PM', mode: 'OFFICE', status: 'PRESENT' },
  ];

  return (
    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR]} requiredPermission={Permission.ATTENDANCE_MANAGE}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Attendance & Shift Monitoring</h2>
          <p className="text-sm text-slate-400">Real-time daily punch logs and shift compliance tracking</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel p-5 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold">On-Time Punch Ins</span>
              <CheckCircle size={18} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-black">94.8%</div>
          </div>

          <div className="glass-panel p-5 border-l-4 border-amber-500">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold">Late Arrivals Today</span>
              <AlertCircle size={18} className="text-amber-400" />
            </div>
            <div className="text-2xl font-black">18 Employees</div>
          </div>

          <div className="glass-panel p-5 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold">Remote Check-Ins</span>
              <Clock size={18} className="text-indigo-400" />
            </div>
            <div className="text-2xl font-black">342 Employees</div>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-base font-bold mb-4">Today's Live Attendance Feed</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/40 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Clock In</th>
                  <th className="py-3 px-4">Clock Out</th>
                  <th className="py-3 px-4">Work Mode</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {attendanceLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/20">
                    <td className="py-3 px-4 font-bold">
                      {log.emp} <span className="text-xs font-normal text-slate-400">({log.code})</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-indigo-400">{log.inTime}</td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-400">{log.outTime}</td>
                    <td className="py-3 px-4">
                      <span className="badge badge-info">{log.mode}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${log.status === 'PRESENT' ? 'badge-success' : log.status === 'LATE' ? 'badge-warning' : 'badge-danger'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">Override Log</Button>
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
