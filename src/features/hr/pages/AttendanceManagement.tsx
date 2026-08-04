import React, { useState } from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';
import { Clock, CheckCircle, AlertCircle, MapPin, Download, Filter, Search, Check, FileSpreadsheet } from 'lucide-react';
import { LiveCheckInWidget } from '../../../components/attendance/LiveCheckInWidget';
import { AttendanceCalendarView } from '../../../components/attendance/AttendanceCalendarView';
import { CSVExport } from '../../../components/tables/CSVExport';
import { useDepartmentAccess } from '../../../hooks/useDepartmentAccess';

export const AttendanceManagement: React.FC = () => {
  const { canAccessDepartment } = useDepartmentAccess();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const attendanceLogs = [
    { id: '1', emp: 'Alex Mercer', code: 'WFA-1005', deptId: 'ENG001', dept: 'Engineering', inTime: '08:58 AM', outTime: '06:15 PM', hours: '09h 17m', mode: 'OFFICE', status: 'PRESENT', location: 'HQ Floor 4' },
    { id: '2', emp: 'Marcus Vance', code: 'WFA-1004', deptId: 'ENG001', dept: 'Engineering', inTime: '09:12 AM', outTime: '06:00 PM', hours: '08h 48m', mode: 'REMOTE', status: 'LATE', location: 'Seattle WFH' },
    { id: '3', emp: 'Chloe Bennett', code: 'WFA-1006', deptId: 'HR001', dept: 'HR', inTime: '--', outTime: '--', hours: '00h 00m', mode: 'REMOTE', status: 'ON_LEAVE', location: 'Approved Sick Leave' },
    { id: '4', emp: 'Liam Thorne', code: 'WFA-1007', deptId: 'FIN001', dept: 'Finance', inTime: '09:01 AM', outTime: '05:30 PM', hours: '08h 29m', mode: 'OFFICE', status: 'PRESENT', location: 'HQ Floor 2' },
    { id: '5', emp: 'Sarah Connor', code: 'WFA-1002', deptId: 'MKT001', dept: 'Marketing', inTime: '08:45 AM', outTime: '06:30 PM', hours: '09h 45m', mode: 'OFFICE', status: 'PRESENT', location: 'HQ Floor 3' },
    { id: '6', emp: 'David Sterling', code: 'WFA-1008', deptId: 'OPS001', dept: 'Operations', inTime: '09:00 AM', outTime: '06:00 PM', hours: '09h 00m', mode: 'REMOTE', status: 'PRESENT', location: 'Austin WFH' },
  ];

  const filteredLogs = attendanceLogs.filter((log) => {
    const hasAccess = canAccessDepartment(log.deptId) || canAccessDepartment(log.dept);
    if (!hasAccess) return false;

    const matchesSearch =
      log.emp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.dept.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR, Role.MANAGER, Role.TEAM_LEAD]} requiredPermission={Permission.ATTENDANCE_MANAGE}>
      <div className="space-y-6 animate-fadeIn font-sans pb-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">Enterprise Attendance & Shift Control Center</h2>
            <p className="text-xs text-slate-400 mt-1">
              Real-time daily punch logs, live clock-ins, hours in office calculations, and monthly compliance calendars across all departments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <CSVExport data={filteredLogs} filename="Stackly_Enterprise_Attendance_Report" />
          </div>
        </div>

        {/* Live Check-In / Out Widget */}
        <LiveCheckInWidget employeeName="Master Console" department="Enterprise Headcount" />

        {/* KPI Compliance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 border-l-4 border-l-emerald-500 shadow-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">On-Time Punch Compliance</span>
              <CheckCircle size={18} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">96.8%</div>
            <p className="text-[10px] text-slate-500 font-mono">+1.2% from last month</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 border-l-4 border-l-amber-500 shadow-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Late Clock-Ins Today</span>
              <AlertCircle size={18} className="text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">18 Employees</div>
            <p className="text-[10px] text-slate-500 font-mono">Requires supervisor review</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 border-l-4 border-l-blue-500 shadow-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Active Remote WFH</span>
              <Clock size={18} className="text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">342 Employees</div>
            <p className="text-[10px] text-slate-500 font-mono">Verified IP Geolocation</p>
          </div>
        </div>

        {/* Interactive Monthly Attendance Calendar */}
        <AttendanceCalendarView />

        {/* Attendance Roster Live Table Feed */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-blue-400" />
              <h3 className="text-base font-extrabold text-white">Daily Attendance Roster & Office Hours Feed</h3>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <Search size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search employee or code..."
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="PRESENT">Present</option>
                <option value="LATE">Late</option>
                <option value="ON_LEAVE">On Leave</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Clock In</th>
                  <th className="py-3 px-4">Clock Out</th>
                  <th className="py-3 px-4">Office Hours</th>
                  <th className="py-3 px-4">Work Mode</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">
                      {log.emp} <span className="text-[10px] font-mono text-slate-400">({log.code})</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-medium">{log.dept}</td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{log.inTime}</td>
                    <td className="py-3 px-4 font-mono text-rose-400 font-bold">{log.outTime}</td>
                    <td className="py-3 px-4 font-mono text-blue-400 font-bold">{log.hours}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        <MapPin size={10} className="text-blue-400" /> {log.mode}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        log.status === 'PRESENT'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : log.status === 'LATE'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="px-2.5 py-1 text-[10px] font-bold bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg border border-blue-500/30 transition-all">
                        Inspect Log
                      </button>
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
