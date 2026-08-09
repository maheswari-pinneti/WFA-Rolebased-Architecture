import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { BarChart, Search, CheckCircle, TrendingUp } from 'lucide-react';

export const HRRecruitmentAnalytics: React.FC = () => {
  return (
    <RoleGuard allowedRoles={[Role.HR, Role.ADMIN]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <BarChart size={24} className="text-purple-400" />
            Recruitment Analytics
          </h2>
          <p className="text-sm text-slate-400">Track active candidate pipelines, cost per hire, and offer conversion metrics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 space-y-2">
            <div className="text-slate-400 text-xs font-bold uppercase">Open Positions</div>
            <div className="text-3xl font-black text-white">18 Roles</div>
            <p className="text-[10px] text-indigo-400 font-bold">12 in Engineering</p>
          </div>

          <div className="glass-panel p-6 space-y-2">
            <div className="text-slate-400 text-xs font-bold uppercase">Time to Hire</div>
            <div className="text-3xl font-black text-white">24 Days</div>
            <p className="text-[10px] text-emerald-400 font-bold">-3 days vs industry avg</p>
          </div>

          <div className="glass-panel p-6 space-y-2">
            <div className="text-slate-400 text-xs font-bold uppercase">Conversion Rate</div>
            <div className="text-3xl font-black text-white">74.5%</div>
            <p className="text-[10px] text-emerald-400 font-bold">+2.1% YTD growth</p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};
