import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { AttendanceChart } from '../../analytics/charts/AttendanceChart';
import { Activity, Users, Clock, AlertCircle } from 'lucide-react';

export const AdminAttendanceOverview: React.FC = () => {
  return (
    <RoleGuard allowedRoles={[Role.ADMIN]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Attendance Analytics Overview</h2>
          <p className="text-sm text-slate-400">Monitor enterprise-wide check-in volumes, presence statistics, and exceptions.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border-slate-800">
            <span className="text-xs text-slate-400 font-bold uppercase">Presence Rate</span>
            <h3 className="text-2xl font-black text-white mt-1">96.4%</h3>
            <span className="text-[10px] text-emerald-400 font-semibold mt-1">Target matched (95.0%)</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-slate-800">
            <span className="text-xs text-slate-400 font-bold uppercase">On-Site Office</span>
            <h3 className="text-2xl font-black text-blue-400 mt-1">154 Active</h3>
            <span className="text-[10px] text-slate-400 mt-1">HQ & Regional Hubs</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-slate-800">
            <span className="text-xs text-slate-400 font-bold uppercase">Remote Flex</span>
            <h3 className="text-2xl font-black text-cyan-400 mt-1">46 Active</h3>
            <span className="text-[10px] text-slate-400 mt-1">Secure VPN connections</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-slate-800">
            <span className="text-xs text-slate-400 font-bold uppercase">Exceptions / Late</span>
            <h3 className="text-2xl font-black text-rose-400 mt-1">8 Flags</h3>
            <span className="text-[10px] text-rose-400 font-semibold mt-1">Requires review</span>
          </div>
        </div>

        {/* Chart Card */}
        <div className="glass-panel p-6 rounded-2xl border-slate-800">
          <AttendanceChart />
        </div>
      </div>
    </RoleGuard>
  );
};
