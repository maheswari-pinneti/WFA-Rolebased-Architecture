import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Activity, Cpu, Zap, BarChart2 } from 'lucide-react';

export const AdminProductivityMetrics: React.FC = () => {
  return (
    <RoleGuard allowedRoles={[Role.ADMIN]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Zap size={24} className="text-cyan-400" />
            Productivity Benchmarking
          </h2>
          <p className="text-sm text-slate-400">Track task delivery metrics, sprint cycles, and average coding velocity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Cpu size={18} className="text-blue-400" />
              SLA Delivery Speed
            </h3>
            <div className="text-3xl font-black text-white">88%</div>
            <p className="text-xs text-slate-400">Average weekly tasks completed within expected scope boundaries.</p>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <BarChart2 size={18} className="text-cyan-400" />
              Commit Velocity
            </h3>
            <div className="text-3xl font-black text-white">4.8 Commits/day</div>
            <p className="text-xs text-slate-400">Normalized codebase contributions registered via GitHub/GitLab integration.</p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};
