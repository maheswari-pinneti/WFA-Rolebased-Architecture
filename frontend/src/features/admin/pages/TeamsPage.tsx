import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { MinimalKpiCard } from '../../../components/ui/MinimalKpiCard';
import { Users, User, Clock, ShieldCheck } from 'lucide-react';

export const TeamsPage: React.FC = () => {
  const mockTeams = [
    { name: 'Core Platform Engineering', lead: 'Arthur Pendelton', members: 12, dept: 'Engineering', status: 'Active' },
    { name: 'UI/UX Design', lead: 'Sarah Connor', members: 8, dept: 'Product', status: 'Active' },
    { name: 'People Operations', lead: 'Elena Rostova', members: 6, dept: 'Human Resources', status: 'Active' },
    { name: 'Global Sales East', lead: 'Alex Mercer', members: 15, dept: 'Sales', status: 'Active' }
  ];

  return (
    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR, Role.MANAGER]}>
      <div className="space-y-6 animate-fadeIn pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <span className="badge badge-manager mb-1">Corporate Teams Directory</span>
            <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
              Teams Management
            </h1>
            <p className="text-xs text-slate-400">
              Manage operational teams, team leadership assignments, and member allocation lists.
            </p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MinimalKpiCard title="Active Teams" value="28 Teams" icon={<Users size={26} />} iconBgColor="blue" trend="100% structured" trendType="positive" />
          <MinimalKpiCard title="Assigned Leads" value="28 Leads" icon={<User size={26} />} iconBgColor="emerald" trend="Zero missing leads" trendType="positive" />
          <MinimalKpiCard title="Average Team Size" value="8.4 members" icon={<Clock size={26} />} iconBgColor="amber" trend="Optimal collaboration ratio" trendType="positive" />
          <MinimalKpiCard title="Operational Health" value="Stable" icon={<ShieldCheck size={26} />} iconBgColor="purple" trend="No structural blockers" trendType="positive" />
        </div>

        {/* Teams List */}
        <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)]">Active Sub-Teams</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-slate-400 font-bold">
                  <th className="p-3">Team Name</th>
                  <th className="p-3">Team Leader</th>
                  <th className="p-3">Total Members</th>
                  <th className="p-3">Parent Department</th>
                  <th className="p-3">Operational Status</th>
                </tr>
              </thead>
              <tbody>
                {mockTeams.map((team, idx) => (
                  <tr key={idx} className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-tertiary)] transition-colors">
                    <td className="p-3 font-semibold text-[var(--text-primary)]">{team.name}</td>
                    <td className="p-3 text-slate-300 font-medium">{team.lead}</td>
                    <td className="p-3 text-slate-400 font-bold">{team.members} Staff</td>
                    <td className="p-3 text-slate-400">{team.dept}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-lg border text-[10px] uppercase bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                        {team.status}
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
