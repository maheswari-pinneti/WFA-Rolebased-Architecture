import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { MinimalKpiCard } from '../../../components/ui/MinimalKpiCard';
import { AnalyticsBarChart } from '../../../components/charts/AnalyticsCharts';
import { Award, Compass, Target, Map } from 'lucide-react';

export const SkillsAnalyticsPage: React.FC = () => {
  const mockSkillsCoverage = [
    { name: 'TypeScript/React', coverage: 82.5 },
    { name: 'NodeJS Backend', coverage: 68.0 },
    { name: 'SQL/Databases', coverage: 59.2 },
    { name: 'Cloud Infrastructure', coverage: 44.5 },
    { name: 'Machine Learning', coverage: 21.0 }
  ];

  const mockSkillsRoster = [
    { name: 'Arthur Pendelton', role: 'Solutions Architect', primarySkills: 'Cloud Infrastructure, Docker, Go', certification: 'AWS Solutions Architect' },
    { name: 'Elena Rostova', role: 'Frontend Lead', primarySkills: 'React, TypeScript, CSS Grid', certification: 'React Advanced Expert' },
    { name: 'Sarah Connor', role: 'Staff Product Manager', primarySkills: 'Roadmapping, User Research, Wireframes', certification: 'Scrum Product Owner' },
    { name: 'Alex Mercer', role: 'Backend Engineer', primarySkills: 'NodeJS, PostgreSQL, Redis', certification: 'Oracle Certified Professional' }
  ];

  return (
    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR, Role.MANAGER]}>
      <div className="space-y-6 animate-fadeIn pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <span className="badge badge-info mb-1">Human Capital IQ</span>
            <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
              Skills Analytics & Competency Desk
            </h1>
            <p className="text-xs text-slate-400">
              Overview of technical competence, team expertise mapping, and skill inventory metrics.
            </p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MinimalKpiCard title="Total Skills Mapped" value="48 Competencies" icon={<Award size={26} />} iconBgColor="emerald" trend="Full Coverage" trendType="positive" />
          <MinimalKpiCard title="Avg Competency Score" value="7.8 / 10" icon={<Compass size={26} />} iconBgColor="blue" trend="+0.4% from Q1" trendType="positive" />
          <MinimalKpiCard title="Skill Gap Rate" value="14% Mismatch" icon={<Target size={26} />} iconBgColor="rose" trend="-2% improvement" trendType="positive" />
          <MinimalKpiCard title="Certification Index" value="86 Certified" icon={<Map size={26} />} iconBgColor="amber" trend="+12 new certs" trendType="positive" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6">
          <AnalyticsBarChart
            title="Skill Area Roster & Coverage %"
            subtitle="Overall organizational capacity per domain"
            data={mockSkillsCoverage}
            xKey="name"
            series={[{ key: 'coverage', name: 'Coverage %', color: '#06b6d4' }]}
            layout="vertical"
          />
        </div>

        {/* Skills Roster */}
        <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)]">Staff Competency Roster</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-slate-400 font-bold">
                  <th className="p-3">Employee</th>
                  <th className="p-3">Designation / Role</th>
                  <th className="p-3">Primary Tech Competencies</th>
                  <th className="p-3">Highest Certification</th>
                </tr>
              </thead>
              <tbody>
                {mockSkillsRoster.map((item, idx) => (
                  <tr key={idx} className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-tertiary)] transition-colors">
                    <td className="p-3 font-semibold text-[var(--text-primary)]">{item.name}</td>
                    <td className="p-3 text-slate-300">{item.role}</td>
                    <td className="p-3 text-slate-400">{item.primarySkills}</td>
                    <td className="p-3 font-bold text-blue-400">{item.certification}</td>
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
