import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';
import { ProductivityVelocity } from '../charts/ProductivityVelocity';
import { PerformanceRadar } from '../charts/PerformanceRadar';
import { ChartCard } from '../../../components/dashboard/ChartCard';
import { Activity, Clock, Flame, CheckCircle, ArrowUpRight } from 'lucide-react';

export const ProductivityAnalyticsPage: React.FC = () => {
  return (
    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR, Role.MANAGER, Role.TEAM_LEAD]} requiredPermission={Permission.TEAM_ANALYTICS_VIEW}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Productivity Analytics</h2>
          <p className="text-sm text-slate-400">Deep-dive insights into developer throughput, operational velocity, and project delivery timelines.</p>
        </div>

        {/* Highlight Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-5 rounded-3xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Overall Velocity</span>
              <h3 className="text-2xl font-black text-white mt-1">94.2%</h3>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
                <ArrowUpRight size={10} /> +2.4% vs last week
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Activity size={20} />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-5 rounded-3xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Average Cycle Time</span>
              <h3 className="text-2xl font-black text-white mt-1">4.2 Days</h3>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
                <ArrowUpRight size={10} /> -0.8 days reduction
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-5 rounded-3xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tasks Completed</span>
              <h3 className="text-2xl font-black text-white mt-1">348</h3>
              <span className="text-[10px] text-blue-400 font-semibold flex items-center gap-0.5 mt-1">
                100% of weekly goal achieved
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <CheckCircle size={20} />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-5 rounded-3xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Burnout Warning Index</span>
              <h3 className="text-2xl font-black text-white mt-1">Low (8%)</h3>
              <span className="text-[10px] text-slate-400 mt-1">Within optimal limits</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Flame size={20} />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ChartCard title="Productivity & Commits Velocity" subtitle="Weekly code submission and development sprint velocity">
              <ProductivityVelocity />
            </ChartCard>
          </div>
          <div>
            <ChartCard title="Operational Performance Vectors" subtitle="Cross-functional capability balance">
              <PerformanceRadar />
            </ChartCard>
          </div>
        </div>

        {/* Teams Productivity Leaderboard */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl">
          <h4 className="text-lg font-bold text-white mb-4">Sprint Group Productivity Rankings</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-500">
                  <th className="pb-3">Team Name</th>
                  <th className="pb-3">Sprint Target</th>
                  <th className="pb-3">Completion Rate</th>
                  <th className="pb-3">Velocity Index</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                <tr>
                  <td className="py-3 font-semibold text-white">Platform Core Eng</td>
                  <td className="py-3">45 Stories</td>
                  <td className="py-3">98%</td>
                  <td className="py-3">1.25</td>
                  <td className="py-3 text-right"><span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Exceptional</span></td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-white">Frontend Experience</td>
                  <td className="py-3">38 Stories</td>
                  <td className="py-3">92%</td>
                  <td className="py-3">1.10</td>
                  <td className="py-3 text-right"><span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">On Track</span></td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-white">Data Intelligence Group</td>
                  <td className="py-3">50 Stories</td>
                  <td className="py-3">89%</td>
                  <td className="py-3">1.04</td>
                  <td className="py-3 text-right"><span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">On Track</span></td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-white">Security Ops & Infrastructure</td>
                  <td className="py-3">30 Stories</td>
                  <td className="py-3">75%</td>
                  <td className="py-3">0.82</td>
                  <td className="py-3 text-right"><span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30">Needs Focus</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};
