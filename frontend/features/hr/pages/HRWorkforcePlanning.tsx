import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Users, TrendingUp, Compass } from 'lucide-react';

export const HRWorkforcePlanning: React.FC = () => {
  return (
    <RoleGuard allowedRoles={[Role.HR, Role.ADMIN]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Compass size={24} className="text-teal-400" />
            Workforce Planning
          </h2>
          <p className="text-sm text-slate-400">Headcount projection modeling and department capacity planners.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 space-y-4">
            <div className="text-slate-400 text-xs font-bold uppercase">Quarterly Target Headcount</div>
            <div className="text-4xl font-black text-white">380 Staff</div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mt-2 border border-slate-700">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full" style={{ width: '84%' }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Current: 320</span>
              <span>84% Complete</span>
            </div>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <div className="text-slate-400 text-xs font-bold uppercase">Capacity Volatility Index</div>
            <div className="text-4xl font-black text-emerald-400">Stable</div>
            <p className="text-xs text-slate-400 leading-relaxed">Turnover volatility score is minimal due to active employee retention campaigns.</p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};
