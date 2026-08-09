import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Activity, Zap } from 'lucide-react';

export const HRProductivityMetrics: React.FC = () => {
  return (
    <RoleGuard allowedRoles={[Role.HR, Role.ADMIN]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Zap size={24} className="text-cyan-400" />
            Employee Productivity Logs
          </h2>
          <p className="text-sm text-slate-400">Benchmarking weekly sprint metrics and core delivery indicators.</p>
        </div>

        <div className="glass-panel p-6 space-y-4">
          <div className="text-slate-400 text-xs font-bold uppercase">Average Task Completion Rate</div>
          <div className="text-3xl font-black text-white">88% SLA met</div>
          <p className="text-xs text-slate-400">Total deliverables completed on schedule within designated sprint timelines.</p>
        </div>
      </div>
    </RoleGuard>
  );
};
