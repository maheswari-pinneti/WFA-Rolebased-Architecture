import React, { useState } from 'react';
import { useAuth } from '../../../auth/hooks/useAuth';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';
import { KPICard } from '../../../components/cards/KPICard';
import { DrillDownModal, DrillDownData } from '../../../shared/components/DrillDownModal';
import { EmployeeTable } from '../../../components/tables/EmployeeTable';

// Custom HR Charts
import { WorkforceTrendLine } from '../../analytics/charts/WorkforceTrendLine';
import { AttritionDonut } from '../../analytics/charts/AttritionDonut';
import { SalaryAnalyticsBar } from '../../analytics/charts/SalaryAnalyticsBar';

import { UserCheck, Users, Briefcase, FileText, Plus, Clock, HeartHandshake, Star, AlertTriangle, DollarSign, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HRDashboard: React.FC = () => {
  const { user } = useAuth();
  const [drillDownData, setDrillDownData] = useState<DrillDownData | null>(null);

  const openDrillDown = (title: string, value: string | number, subtitle: string, details: { label: string; value: string | number }[]) => {
    setDrillDownData({
      title,
      metricValue: value,
      subtitle,
      category: 'HR Operations Lifecycle',
      details,
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'Elena';

  const candidatePipeline = [
    { name: 'Michael Faraday', role: 'Staff Frontend Engineer', stage: 'Technical Interview', status: 'SCHEDULED' },
    { name: 'Ada Lovelace', role: 'Principal Systems Architect', stage: 'Final Leadership Round', status: 'IN_REVIEW' },
    { name: 'Alan Turing', role: 'Senior AI Specialist', stage: 'Offer Stage', status: 'PENDING' },
    { name: 'Grace Hopper', role: 'DevOps Lead Engineer', stage: 'Initial Screening', status: 'COMPLETED' },
  ];

  return (
    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR]} requiredPermission={Permission.EMPLOYEE_READ}>
      <div className="space-y-6 animate-fadeIn font-sans">
        {/* HR Header Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/40 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center shrink-0">
              <UserCheck size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight text-white">{getGreeting()}, {firstName} 👋</h2>
                <span className="badge badge-hr">HR OPERATIONS PORTAL</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Workforce lifecycle, candidate recruitment, payroll analysis & employee attendance oversight.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/hr/employees" className="btn btn-primary btn-sm flex items-center gap-1.5 shadow-md">
              <Plus size={14} /> Add Employee
            </Link>
            <Link to="/hr/recruitment" className="btn btn-secondary btn-sm flex items-center gap-1.5">
              <Briefcase size={14} /> Recruitment Desk
            </Link>
          </div>
        </div>



        {/* 8 Reusable HR KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Headcount"
            value="1,248 Staff"
            change={8.4}
            trend="up"
            subtitle="Global workforce"
            icon={<Users size={20} />}
            accentColor="purple"
            onClick={() => openDrillDown('Total Headcount Breakdown', '1,248 Staff', 'Full workforce employment contracts', [
              { label: 'Full-Time Permanent', value: 1140 },
              { label: 'Contractors', value: 78 },
              { label: 'Interns & Fellows', value: 30 },
            ])}
          />
          <KPICard
            title="Recruitment Pipeline"
            value="18 Active"
            change={4.2}
            trend="up"
            subtitle="3 Offers pending"
            icon={<Briefcase size={20} />}
            accentColor="blue"
            onClick={() => openDrillDown('Talent Acquisition Pipeline', '18 Active Candidates', 'Open requisitions and interview stages', [
              { label: 'Screening Stage', value: 6 },
              { label: 'Technical Rounds', value: 9 },
              { label: 'Offers Released', value: 3 },
            ])}
          />
          <KPICard
            title="Shift Attendance"
            value="98.2%"
            change={1.2}
            trend="up"
            subtitle="Monthly average"
            icon={<Clock size={20} />}
            accentColor="emerald"
            onClick={() => openDrillDown('Workforce Attendance Rate', '98.2%', 'Overall shift presence & clock-in compliance', [
              { label: 'On-Time Clock Ins', value: '96.8%' },
              { label: 'Late Clock Ins', value: '1.4%' },
              { label: 'Unexcused Absences', value: '0.2%' },
            ])}
          />
          <KPICard
            title="Leave Requests"
            value="14 Pending"
            change={-2.4}
            trend="down"
            subtitle="Requires HR review"
            icon={<FileText size={20} />}
            accentColor="amber"
            onClick={() => openDrillDown('Pending Leave & PTO Requests', '14 Pending', 'Employee vacation and medical leave queue', [
              { label: 'Vacation Leave', value: 8 },
              { label: 'Sick / Medical', value: 4 },
              { label: 'Parental Leave', value: 2 },
            ])}
          />
          <KPICard
            title="Payroll Budget"
            value="$4.82M / mo"
            change={2.0}
            trend="up"
            subtitle="Monthly salary cost"
            icon={<DollarSign size={20} />}
            accentColor="emerald"
            onClick={() => openDrillDown('Monthly Payroll Budget', '$4,820,000', 'Total compensation and benefits allocation', [
              { label: 'Base Salaries', value: '$3,950,000' },
              { label: 'Health Benefits', value: '$520,000' },
              { label: 'Bonuses & Incentives', value: '$350,000' },
            ])}
          />
          <KPICard
            title="eNPS Satisfaction"
            value="95.2 Score"
            change={3.0}
            trend="up"
            subtitle="Satisfaction benchmark"
            icon={<HeartHandshake size={20} />}
            accentColor="cyan"
            onClick={() => openDrillDown('Employee Engagement Score', '95.2 eNPS', 'Quarterly employee survey satisfaction', [
              { label: 'Promoters', value: '88%' },
              { label: 'Passives', value: '9%' },
              { label: 'Detractors', value: '3%' },
            ])}
          />
          <KPICard
            title="Performance Review"
            value="4.8 / 5.0"
            change={0.4}
            trend="up"
            subtitle="Q2 Review score"
            icon={<Star size={20} />}
            accentColor="amber"
            onClick={() => openDrillDown('Q2 Performance Evaluation', '4.8 / 5.0 Avg', 'Organization performance ratings', [
              { label: 'Exceeds Target', value: '42%' },
              { label: 'Meets Target', value: '54%' },
              { label: 'Needs Improvement', value: '4%' },
            ])}
          />
          <KPICard
            title="Attrition Risk"
            value="1.2% Low"
            change={-0.8}
            trend="down"
            subtitle="Top retention rate"
            icon={<AlertTriangle size={20} />}
            accentColor="rose"
            onClick={() => openDrillDown('Workforce Attrition Risk', '1.2% Low', 'Predictive attrition & turnover analysis', [
              { label: 'Voluntary Turnover', value: '0.9%' },
              { label: 'Involuntary Turnover', value: '0.3%' },
            ])}
          />
        </div>

        {/* Section 1: Candidate Pipeline & Retention Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Briefcase size={18} className="text-purple-400" /> Active Talent Acquisition Candidate Pipeline
              </h3>
              <Link to="/hr/recruitment" className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1">
                View Desk <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-2.5">
              {candidatePipeline.map((c, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-sm text-[var(--text-primary)]">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.role} • <span className="text-purple-400 font-semibold">{c.stage}</span></p>
                  </div>
                  <span className="badge badge-success text-[10px] uppercase font-bold">{c.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Users size={18} className="text-emerald-400" /> Retention Rate & Attrition Donut Analysis
            </h3>
            <AttritionDonut />
          </div>
        </div>

        {/* Section 2: Workforce Growth Timeline & Salary Analytics Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Users size={18} className="text-blue-400" /> Monthly Workforce Growth Timeline
            </h3>
            <WorkforceTrendLine />
          </div>

          <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <DollarSign size={18} className="text-amber-400" /> Department Salary & Compensation Analytics
            </h3>
            <SalaryAnalyticsBar />
          </div>
        </div>

        {/* Section 3: Employee Table */}
        <EmployeeTable />

        {/* Drill-Down Modal */}
        <DrillDownModal
          isOpen={drillDownData !== null}
          onClose={() => setDrillDownData(null)}
          data={drillDownData}
        />
      </div>
    </RoleGuard>
  );
};
