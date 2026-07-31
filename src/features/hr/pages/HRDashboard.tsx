import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';
import { KPICard } from '../../../components/cards/KPICard';
import { EmployeeTable } from '../../../components/tables/EmployeeTable';
import { AttritionDonut } from '../../analytics/charts/AttritionDonut';
import { SalaryAnalyticsBar } from '../../analytics/charts/SalaryAnalyticsBar';
import { UserCheck, Users, Briefcase, FileText, Plus, CheckCircle2, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HRDashboard: React.FC = () => {
  const recruitmentCandidates = [
    { name: 'Michael Faraday', role: 'Staff Frontend Engineer', stage: 'Technical Interview', status: 'SCHEDULED' },
    { name: 'Ada Lovelace', role: 'Principal Systems Architect', stage: 'Final Leadership Round', status: 'IN_REVIEW' },
    { name: 'Alan Turing', role: 'Senior AI Specialist', stage: 'Offer Stage', status: 'PENDING' },
  ];

  return (
    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR]} requiredPermission={Permission.EMPLOYEE_READ}>
      <div className="space-y-6 animate-fadeIn">
        {/* HR Header Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/40 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center shrink-0">
              <UserCheck size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight text-white">HR Operations & Talent Portal</h2>
                <span className="badge badge-hr">WORKFORCE OPERATIONS</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Workforce lifecycle, candidate recruitment, payroll analysis & employee attendance oversight.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/hr/employees" className="btn btn-primary btn-sm flex items-center gap-1.5">
              <Plus size={14} /> Add Employee
            </Link>
            <Link to="/hr/recruitment" className="btn btn-secondary btn-sm flex items-center gap-1.5">
              <Briefcase size={14} /> Recruitment Desk
            </Link>
          </div>
        </div>

        {/* HR Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Total Headcount" value="1,248 Employees" change={8.4} trend="up" subtitle="Global workforce" icon={<Users size={20} />} accentColor="purple" />
          <KPICard title="Open Candidate Pipeline" value="18 Active" change={4.2} trend="up" subtitle="3 Offers pending" icon={<Briefcase size={20} />} accentColor="blue" />
          <KPICard title="Shift Attendance Rate" value="98.2%" change={1.2} trend="up" subtitle="Monthly average" icon={<Clock size={20} />} accentColor="emerald" />
          <KPICard title="Leave & PTO Queue" value="14 Pending" change={-2.4} trend="down" subtitle="Requires HR review" icon={<FileText size={20} />} accentColor="amber" />
        </div>

        {/* HR-Specific Section 1: Active Candidate Pipeline & Attrition Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Briefcase size={18} className="text-purple-400" /> Active Talent Acquisition Pipeline
              </h3>
              <Link to="/hr/recruitment" className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1">
                View Desk <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-2.5">
              {recruitmentCandidates.map((c, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-sm text-[var(--text-primary)]">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.role} • <span className="text-purple-400 font-medium">{c.stage}</span></p>
                  </div>
                  <span className="badge badge-success text-[10px]">{c.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Users size={18} className="text-emerald-400" /> Retention Rate & Attrition Analysis
            </h3>
            <AttritionDonut />
          </div>
        </div>

        {/* HR-Specific Section 2: Salary & Compensation Analytics */}
        <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <FileText size={18} className="text-amber-400" /> Department Salary & Compensation Analytics
          </h3>
          <SalaryAnalyticsBar />
        </div>

        {/* HR-Specific Section 3: Employee Directory Table */}
        <EmployeeTable />
      </div>
    </RoleGuard>
  );
};
