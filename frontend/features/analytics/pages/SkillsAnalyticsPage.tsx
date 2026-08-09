import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';
import { SkillMatrixChart } from '../charts/SkillMatrixChart';
import { EmployeeEngagementRadar } from '../charts/EmployeeEngagementRadar';
import { ChartCard } from '../../../components/dashboard/ChartCard';
import { Award, Compass, Search, Filter } from 'lucide-react';

export const SkillsAnalyticsPage: React.FC = () => {
  return (
    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR, Role.MANAGER, Role.TEAM_LEAD]} requiredPermission={Permission.TEAM_ANALYTICS_VIEW}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Skills & Capabilities Analytics</h2>
          <p className="text-sm text-slate-400">Track competency coverage, identify skill gaps, and optimize training path plans across departments.</p>
        </div>

        {/* Highlight Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-5 rounded-3xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Skill Alignment Index</span>
              <h3 className="text-2xl font-black text-white mt-1">87.5%</h3>
              <span className="text-[10px] text-emerald-400 font-semibold mt-1">
                +4.2% increase this quarter
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Award size={20} />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-5 rounded-3xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Critical Gaps Identified</span>
              <h3 className="text-2xl font-black text-white mt-1">12 Gaps</h3>
              <span className="text-[10px] text-rose-400 font-semibold mt-1">
                3 in high-priority departments
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Compass size={20} />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-5 rounded-3xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Certified Employees</span>
              <h3 className="text-2xl font-black text-white mt-1">74.1%</h3>
              <span className="text-[10px] text-emerald-400 font-semibold mt-1">
                Goal 80% by end of year
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Award size={20} />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ChartCard title="Skill Competency Levels by Department" subtitle="Average proficiency score in core framework categories">
              <SkillMatrixChart />
            </ChartCard>
          </div>
          <div>
            <ChartCard title="Employee Competency Spread" subtitle="Radar view of multi-disciplinary skill balances">
              <EmployeeEngagementRadar />
            </ChartCard>
          </div>
        </div>

        {/* Core Skill Categories Table */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold text-white">Framework Capability Distribution</h4>
            <div className="flex gap-2">
              <button className="bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5">
                <Filter size={12} /> Filter
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-500">
                  <th className="pb-3">Skill Subject</th>
                  <th className="pb-3">Primary Tech</th>
                  <th className="pb-3">Certified Engineers</th>
                  <th className="pb-3">Average Proficiency</th>
                  <th className="pb-3 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                <tr>
                  <td className="py-3 font-semibold text-white">Frontend Frameworks</td>
                  <td className="py-3">React / Next.js</td>
                  <td className="py-3">34 Employees</td>
                  <td className="py-3">4.2 / 5.0</td>
                  <td className="py-3 text-right text-emerald-400 font-bold">↗ Increasing</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-white">Backend Systems</td>
                  <td className="py-3">Node.js / Go</td>
                  <td className="py-3">28 Employees</td>
                  <td className="py-3">3.9 / 5.0</td>
                  <td className="py-3 text-right text-emerald-400 font-bold">↗ Increasing</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-white">Cloud Infrastructure</td>
                  <td className="py-3">AWS / Kubernetes</td>
                  <td className="py-3">15 Employees</td>
                  <td className="py-3">3.5 / 5.0</td>
                  <td className="py-3 text-right text-slate-400 font-bold">→ Stable</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-white">Data Science & ML</td>
                  <td className="py-3">Python / PyTorch</td>
                  <td className="py-3">9 Employees</td>
                  <td className="py-3">3.1 / 5.0</td>
                  <td className="py-3 text-right text-rose-400 font-bold">↘ Critical Gap</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};
