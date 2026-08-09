import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';
import { AttritionDonut } from '../charts/AttritionDonut';
import { PerformanceAreaChart } from '../charts/PerformanceAreaChart';
import { ChartCard } from '../../../components/dashboard/ChartCard';
import { AlertTriangle, ShieldCheck, HeartCrack, Activity } from 'lucide-react';

export const RiskAnalyticsPage: React.FC = () => {
  return (
    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR, Role.MANAGER, Role.TEAM_LEAD]} requiredPermission={Permission.TEAM_ANALYTICS_VIEW}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Workforce Risk & Compliance Analytics</h2>
          <p className="text-sm text-slate-400">Proactively analyze flight risk vectors, workload burnout indexes, and geofencing compliance ratings.</p>
        </div>

        {/* Highlight Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-5 rounded-3xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Overall Risk Index</span>
              <h3 className="text-2xl font-black text-white mt-1">Medium (12%)</h3>
              <span className="text-[10px] text-emerald-400 font-semibold mt-1">
                -1.5% decrease vs last month
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Activity size={20} />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-5 rounded-3xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">High Flight Risk</span>
              <h3 className="text-2xl font-black text-rose-400 mt-1">4 Employees</h3>
              <span className="text-[10px] text-slate-400 mt-1">
                Targeted retention plan active
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <HeartCrack size={20} />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-5 rounded-3xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Geofence Compliance</span>
              <h3 className="text-2xl font-black text-white mt-1">99.8%</h3>
              <span className="text-[10px] text-emerald-400 font-semibold mt-1">
                Zero security bypass checks
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-5 rounded-3xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Burnout Indicators</span>
              <h3 className="text-2xl font-black text-white mt-1">11 Warnings</h3>
              <span className="text-[10px] text-rose-400 font-semibold mt-1">
                8 in engineering group
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <ChartCard title="Flight Risk & Attrition Factors" subtitle="Calculated distribution based on role engagement scores">
              <AttritionDonut />
            </ChartCard>
          </div>
          <div className="md:col-span-2">
            <ChartCard title="Departmental Performance Stability" subtitle="Performance volatility and workload trends">
              <PerformanceAreaChart />
            </ChartCard>
          </div>
        </div>

        {/* Key Risk Indicators Log */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl">
          <h4 className="text-lg font-bold text-white mb-4">Urgent Retention & Burnout Notifications</h4>
          <div className="space-y-3">
            <div className="flex gap-4 items-start p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
              <AlertTriangle className="text-rose-400 shrink-0 mt-0.5" size={18} />
              <div>
                <h5 className="font-bold text-white text-sm">Burnout Alert: Core Platform Engineering</h5>
                <p className="text-xs text-slate-300 mt-0.5">Average weekly working hours exceeded 48 hours for 4 consecutive weeks. Flight risk multiplier increased by 1.4x.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
              <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={18} />
              <div>
                <h5 className="font-bold text-white text-sm">Compensation Disparity Detected: Data Intelligence</h5>
                <p className="text-xs text-slate-300 mt-0.5">2 Senior MLE engineers are currently flagged with high salary disparity scores relative to Bengaluru regional averages.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
              <ShieldCheck className="text-blue-400 shrink-0 mt-0.5" size={18} />
              <div>
                <h5 className="font-bold text-white text-sm">Geofencing & Security Boundaries: 100% Compliant</h5>
                <p className="text-xs text-slate-300 mt-0.5">All mobile remote punch-in events were validated successfully within Bengaluru workplace geofences.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};
