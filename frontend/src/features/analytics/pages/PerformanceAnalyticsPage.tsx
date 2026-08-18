import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { MinimalKpiCard } from '../../../components/ui/MinimalKpiCard';
import { AnalyticsLineChart } from '../../../components/charts/AnalyticsCharts';
import { Gauge, Target, Award, Users } from 'lucide-react';

export const PerformanceAnalyticsPage: React.FC = () => {
  const mockPerformanceTrend = [
    { name: 'Jan', performance: 88, target: 85 },
    { name: 'Feb', performance: 89, target: 85 },
    { name: 'Mar', performance: 91, target: 86 },
    { name: 'Apr', performance: 90, target: 86 },
    { name: 'May', performance: 92, target: 87 },
    { name: 'Jun', performance: 94, target: 88 }
  ];

  const mockPerformanceReviews = [
    { name: 'Jane Doe', role: 'Sr. Backend Dev', score: '9.6/10', reviewStatus: 'Completed', rating: 'Exceptional' },
    { name: 'John Smith', role: 'Frontend Dev', score: '9.2/10', reviewStatus: 'Completed', rating: 'Strong' },
    { name: 'Bob Johnson', role: 'Database Admin', score: '8.8/10', reviewStatus: 'Completed', rating: 'Meets Standards' },
    { name: 'Alice Brown', role: 'DevOps Lead', score: '9.4/10', reviewStatus: 'Completed', rating: 'Strong' }
  ];

  return (
    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR, Role.MANAGER]}>
      <div className="space-y-6 animate-fadeIn pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <span className="badge badge-manager mb-1">Performance Intelligence</span>
            <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
              Performance Analytics
            </h1>
            <p className="text-xs text-slate-400">
              Correlate team performance metrics, target completion percentages, and review status.
            </p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MinimalKpiCard title="Avg Performance" value="92.4%" icon={<Gauge size={26} />} iconBgColor="emerald" trend="+1.5% this quarter" trendType="positive" />
          <MinimalKpiCard title="Targets Achieved" value="96.5%" icon={<Target size={26} />} iconBgColor="blue" trend="+0.5% compliance" trendType="positive" />
          <MinimalKpiCard title="High Rating Ratio" value="28%" icon={<Award size={26} />} iconBgColor="purple" trend="+4% exceptional ratings" trendType="positive" />
          <MinimalKpiCard title="Completed Reviews" value="100%" icon={<Users size={26} />} iconBgColor="amber" trend="All staff evaluated" trendType="positive" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6">
          <AnalyticsLineChart
            title="Performance Score Trend vs Target"
            subtitle="Calculated average performance versus target benchmarks"
            data={mockPerformanceTrend}
            xKey="name"
            series={[
              { key: 'performance', name: 'Performance', color: '#8b5cf6' },
              { key: 'target', name: 'Target', color: '#f59e0b' }
            ]}
          />
        </div>

        {/* Reviews */}
        <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)]">Employee Performance Records</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-slate-400 font-bold">
                  <th className="p-3">Employee</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Review Score</th>
                  <th className="p-3">Review Status</th>
                  <th className="p-3">Performance Class</th>
                </tr>
              </thead>
              <tbody>
                {mockPerformanceReviews.map((item, idx) => (
                  <tr key={idx} className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-tertiary)] transition-colors">
                    <td className="p-3 font-semibold text-[var(--text-primary)]">{item.name}</td>
                    <td className="p-3 text-slate-300">{item.role}</td>
                    <td className="p-3 font-bold text-indigo-400">{item.score}</td>
                    <td className="p-3 text-slate-400">{item.reviewStatus}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-lg border text-[10px] uppercase ${item.rating === 'Exceptional' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-blue-500/15 text-blue-400 border-blue-500/30'}`}>
                        {item.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};
