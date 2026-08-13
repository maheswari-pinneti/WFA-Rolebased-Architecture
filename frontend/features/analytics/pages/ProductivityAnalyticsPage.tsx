import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { MinimalKpiCard } from '../../../components/ui/MinimalKpiCard';
import { AnalyticsBarChart } from '../../../components/charts/AnalyticsCharts';
import { Activity, ShieldCheck, Zap, TrendingUp } from 'lucide-react';

export const ProductivityAnalyticsPage: React.FC = () => {
  const mockTeamProductivity = [
    { name: 'Core Platform', productivity: 95.8, members: 12 },
    { name: 'UI & Frontend', productivity: 94.2, members: 8 },
    { name: 'Data Pipeline', productivity: 92.5, members: 6 },
    { name: 'DevOps & Cloud', productivity: 91.0, members: 5 },
    { name: 'Mobile App', productivity: 88.5, members: 7 }
  ];

  const mockEmployeeProductivity = [
    { name: 'Jane Doe', team: 'Core Platform', score: '98%', tasks: 48, rate: '100% on-time' },
    { name: 'John Smith', team: 'UI & Frontend', score: '95%', tasks: 42, rate: '95% on-time' },
    { name: 'Bob Johnson', team: 'Data Pipeline', score: '92%', tasks: 38, rate: '90% on-time' },
    { name: 'Alice Brown', team: 'DevOps & Cloud', score: '91%', tasks: 35, rate: '92% on-time' },
    { name: 'Charlie Green', team: 'Mobile App', score: '89%', tasks: 30, rate: '85% on-time' }
  ];

  return (
    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR, Role.MANAGER]}>
      <div className="space-y-6 animate-fadeIn pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <span className="badge badge-admin mb-1">Operations Intelligence</span>
            <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
              Productivity Analytics
            </h1>
            <p className="text-xs text-slate-400">
              Real-time developer throughput, code velocity, and task completion metrics.
            </p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MinimalKpiCard title="Avg Productivity" value="92.4%" icon={<Zap size={26} />} iconBgColor="emerald" trend="+2.1% this week" trendType="positive" />
          <MinimalKpiCard title="Active Sprint Tasks" value="193 Tasks" icon={<Activity size={26} />} iconBgColor="blue" trend="94% completed" trendType="positive" />
          <MinimalKpiCard title="Sprint Adherence" value="95.2%" icon={<ShieldCheck size={26} />} iconBgColor="amber" trend="100% compliant" trendType="positive" />
          <MinimalKpiCard title="Efficiency Score" value="9.4/10" icon={<TrendingUp size={26} />} iconBgColor="emerald" trend="Optimal Output" trendType="positive" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6">
          <AnalyticsBarChart
            title="Average Productivity by Team"
            subtitle="Developer activity score in percentage"
            data={mockTeamProductivity}
            xKey="name"
            series={[{ key: 'productivity', name: 'Productivity %', color: '#8b5cf6' }]}
          />
        </div>

        {/* Employee Roster */}
        <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)]">Individual Performance Metrics</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-slate-400 font-bold">
                  <th className="p-3">Employee</th>
                  <th className="p-3">Team</th>
                  <th className="p-3">Productivity Score</th>
                  <th className="p-3">Completed Tasks</th>
                  <th className="p-3">Delivery Rate</th>
                </tr>
              </thead>
              <tbody>
                {mockEmployeeProductivity.map((emp, idx) => (
                  <tr key={idx} className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-tertiary)] transition-colors">
                    <td className="p-3 font-semibold text-[var(--text-primary)]">{emp.name}</td>
                    <td className="p-3 text-slate-300">{emp.team}</td>
                    <td className="p-3 font-bold text-emerald-400">{emp.score}</td>
                    <td className="p-3 text-slate-400">{emp.tasks}</td>
                    <td className="p-3 text-slate-400">{emp.rate}</td>
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
