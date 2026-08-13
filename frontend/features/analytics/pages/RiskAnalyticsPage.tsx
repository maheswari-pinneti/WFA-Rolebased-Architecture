import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { MinimalKpiCard } from '../../../components/ui/MinimalKpiCard';
import { AnalyticsDonutChart } from '../../../components/charts/AnalyticsCharts';
import { AlertTriangle, Users, HeartCrack, Activity } from 'lucide-react';

export const RiskAnalyticsPage: React.FC = () => {
  const mockRiskDistribution = [
    { name: 'High Risk', value: 8 },
    { name: 'Medium Risk', value: 24 },
    { name: 'Low Risk', value: 120 }
  ];

  const mockRiskRoster = [
    { name: 'Charlie Green', department: 'Product Design', riskFactor: 'High', reason: 'High overtime hours & low sprint activity', rating: 9.2 },
    { name: 'David Miller', department: 'Core Engineering', riskFactor: 'High', reason: 'Repeated late clock-ins & consecutive absences', rating: 8.8 },
    { name: 'Eva Long', department: 'Customer Success', riskFactor: 'Medium', reason: 'Decreased performance score trend', rating: 7.1 },
    { name: 'Frank Wright', department: 'Enterprise Sales', riskFactor: 'Medium', reason: 'Unused paid leave balance > 30 days', rating: 6.5 }
  ];

  return (
    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR, Role.MANAGER]}>
      <div className="space-y-6 animate-fadeIn pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <span className="badge badge-danger mb-1">Retention Observatory</span>
            <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
              Risk & Attrition Analytics
            </h1>
            <p className="text-xs text-slate-400">
              Identify flight risk, burnout indicators, and fatigue alerts across departments.
            </p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MinimalKpiCard title="High Risk Staff" value="8 Employees" icon={<AlertTriangle size={26} />} iconBgColor="rose" trend="Action required" trendType="negative" />
          <MinimalKpiCard title="Medium Risk Staff" value="24 Employees" icon={<HeartCrack size={26} />} iconBgColor="amber" trend="Monitor closely" trendType={undefined} />
          <MinimalKpiCard title="Burnout Safety Rate" value="94.2%" icon={<Users size={26} />} iconBgColor="emerald" trend="Optimal workload limit" trendType="positive" />
          <MinimalKpiCard title="Attrition Alert Level" value="Low" icon={<Activity size={26} />} iconBgColor="blue" trend="Stable workforce" trendType="positive" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6">
          <AnalyticsDonutChart
            title="Retention Risk Distribution"
            subtitle="Overall employee headcount by risk category"
            data={mockRiskDistribution}
            colors={['#ef4444', '#f59e0b', '#10b981']}
          />
        </div>

        {/* Risk Roster */}
        <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)]">Retention Risk Registry</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-slate-400 font-bold">
                  <th className="p-3">Employee</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Risk Factor</th>
                  <th className="p-3">Burnout Reason</th>
                  <th className="p-3">Calculated Risk Rating</th>
                </tr>
              </thead>
              <tbody>
                {mockRiskRoster.map((item, idx) => (
                  <tr key={idx} className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-tertiary)] transition-colors">
                    <td className="p-3 font-semibold text-[var(--text-primary)]">{item.name}</td>
                    <td className="p-3 text-slate-300">{item.department}</td>
                    <td className="p-3 font-bold">
                      <span className={`px-2 py-0.5 rounded-lg border text-[10px] uppercase ${item.riskFactor === 'High' ? 'bg-red-500/15 text-red-400 border-red-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30'}`}>
                        {item.riskFactor}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{item.reason}</td>
                    <td className="p-3 font-mono font-bold text-rose-400">{item.rating} / 10</td>
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
