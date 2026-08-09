import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Award, Star, CheckCircle, TrendingUp } from 'lucide-react';

export const AdminPerformanceOverview: React.FC = () => {
  return (
    <RoleGuard allowedRoles={[Role.ADMIN]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Award size={24} className="text-yellow-400" />
            Performance Milestones
          </h2>
          <p className="text-sm text-slate-400">Quarterly KPI achievement records and performance appraisals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
              <span>Avg KPI Score</span>
              <TrendingUp size={16} className="text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white">84.6%</p>
            <p className="text-[10px] text-emerald-400 font-bold">+1.2% vs Last Quarter</p>
          </div>

          <div className="glass-panel p-6 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
              <span>Target Achieved</span>
              <CheckCircle size={16} className="text-blue-400" />
            </div>
            <p className="text-2xl font-black text-white">96%</p>
            <p className="text-[10px] text-slate-400">Department level target</p>
          </div>

          <div className="glass-panel p-6 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
              <span>Appraisal Progress</span>
              <Star size={16} className="text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white">180 / 200 Done</p>
            <p className="text-[10px] text-indigo-400 font-bold">90% completion rate</p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};
