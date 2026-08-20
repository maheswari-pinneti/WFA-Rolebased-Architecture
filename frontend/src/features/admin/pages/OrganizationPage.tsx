import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { MinimalKpiCard } from '../../../components/ui/MinimalKpiCard';
import { Building2, Users, MapPin, GitBranch } from 'lucide-react';

export const OrganizationPage: React.FC = () => {
  const departments = [
    { name: 'Engineering', head: 'Marcus Vance', headcount: 85, location: 'Bengaluru, Hyderabad' },
    { name: 'Product Management', head: 'Sarah Connor', headcount: 85, location: 'Hyderabad, Salem' },
    { name: 'Sales & Marketing', head: 'David Sterling', headcount: 85, location: 'Salem, Bengaluru' },
    { name: 'Human Resources', head: 'Elena Rostova', headcount: 85, location: 'Bengaluru, Hyderabad' },
    { name: 'Customer Success', head: 'Alex Mercer', headcount: 80, location: 'Hyderabad, Salem' },
    { name: 'Finance & Operations', head: 'Finance Manager', headcount: 80, location: 'Salem, Bengaluru' }
  ];

  return (
    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR, Role.MANAGER]}>
      <div className="space-y-6 animate-fadeIn pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <span className="badge badge-manager mb-1">Organization Governance</span>
            <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
              Organization Structure
            </h1>
            <p className="text-xs text-slate-400">
              Configure department structures, corporate reporting lines, and headcount assignments.
            </p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MinimalKpiCard title="Total Headcount" value="500 Employees" icon={<Users size={18} />} iconBgColor="blue" trend="+12% Growth Q2" trendType="positive" />
          <MinimalKpiCard title="Departments" value="6 Active" icon={<Building2 size={18} />} iconBgColor="indigo" trend="Full Structural Coverage" trendType="positive" />
          <MinimalKpiCard title="Global Locations" value="3 Offices" icon={<MapPin size={18} />} iconBgColor="cyan" trend="BLR, HYD, SLM" trendType="positive" />
          <MinimalKpiCard title="Reporting Line" value="100% Mapped" icon={<GitBranch size={18} />} iconBgColor="emerald" trend="Zero Unassigned Staff" trendType="positive" />
        </div>

        {/* Corporate Hierarchy */}
        <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Building2 size={18} className="text-indigo-400" /> Corporate Department Hierarchy
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[var(--text-primary)]">{dept.name}</span>
                  <span className="badge badge-info text-[10px]">{dept.headcount} Staff</span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Users size={14} /> Department Head: <span className="font-semibold text-slate-200">{dept.head}</span>
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin size={14} /> Locations: <span className="font-medium text-slate-300">{dept.location}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};
