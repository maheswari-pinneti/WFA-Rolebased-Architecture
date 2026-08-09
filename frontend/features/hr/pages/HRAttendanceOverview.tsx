import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { AttendanceChart } from '../../analytics/charts/AttendanceChart';
import { Activity, Clock } from 'lucide-react';

export const HRAttendanceOverview: React.FC = () => {
  return (
    <RoleGuard allowedRoles={[Role.HR, Role.ADMIN]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Activity size={24} className="text-emerald-400" />
            Attendance KPI Overview
          </h2>
          <p className="text-sm text-slate-400">High-level statistics dashboard monitoring active check-ins and late counters.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 space-y-2">
            <div className="text-slate-400 text-xs font-bold uppercase">Presence Rate</div>
            <div className="text-3xl font-black text-white">96.5%</div>
            <p className="text-[10px] text-emerald-400 font-semibold mt-1">Excellent stability rating</p>
          </div>

          <div className="glass-panel p-6 space-y-2">
            <div className="text-slate-400 text-xs font-bold uppercase">Late Check-Ins</div>
            <div className="text-3xl font-black text-rose-400">3 Employees</div>
            <p className="text-[10px] text-slate-400 mt-1">Requires grace review</p>
          </div>

          <div className="glass-panel p-6 space-y-2">
            <div className="text-slate-400 text-xs font-bold uppercase">Leave Active</div>
            <div className="text-3xl font-black text-blue-400">14 Active</div>
            <p className="text-[10px] text-slate-400 mt-1">Sabbaticals and medical</p>
          </div>
        </div>

        <div className="glass-panel p-6">
          <AttendanceChart />
        </div>
      </div>
    </RoleGuard>
  );
};
