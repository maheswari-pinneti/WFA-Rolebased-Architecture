import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';
import { KPICard } from '../../../components/cards/KPICard';
import { EmployeeTable } from '../../../components/tables/EmployeeTable';
import { WorkforceTrendLine } from '../../analytics/charts/WorkforceTrendLine';
import { DepartmentOverviewBar } from '../../analytics/charts/DepartmentOverviewBar';
import { AttendanceAnalyticsArea } from '../../analytics/charts/AttendanceAnalyticsArea';
import { EmployeeDistributionPie } from '../../analytics/charts/EmployeeDistributionPie';
import { PerformanceRadar } from '../../analytics/charts/PerformanceRadar';
import { SalaryAnalyticsBar } from '../../analytics/charts/SalaryAnalyticsBar';
import { AttritionDonut } from '../../analytics/charts/AttritionDonut';
import { ExportReport } from '../../reports/components/ExportReport';
import { GitPullRequest, Users, UserCheck, ShieldCheck, Zap, HeartHandshake, FileText, Star, AlertTriangle } from 'lucide-react';

export const TeamLeadDashboard: React.FC = () => {
  return (
    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR, Role.MANAGER, Role.TEAM_LEAD]} requiredPermission={Permission.TEAM_ANALYTICS_VIEW}>
      <div className="space-y-6">
        {/* Team Lead Header Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-950/50 via-slate-900 to-cyan-950/40 border border-teal-500/30 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center shrink-0">
              <GitPullRequest size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight text-white">Stackly Team Lead Sprint Console</h2>
                <span className="badge badge-lead">SPRINT EXECUTION</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">Daily standups, PR review queues, sprint burnup & blocker resolution</p>
            </div>
          </div>
        </div>

        {/* 1. KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Total Employees" value="10 Devs" change={0.0} trend="neutral" subtitle="Full squad present" icon={<Users size={20} />} accentColor="cyan" />
          <KPICard title="Active Workforce" value="10 / 10 (100%)" change={0.0} trend="neutral" subtitle="On duty today" icon={<UserCheck size={20} />} accentColor="emerald" />
          <KPICard title="Attendance Rate" value="98.2%" change={1.2} trend="up" subtitle="Punctuality index" icon={<ShieldCheck size={20} />} accentColor="cyan" />
          <KPICard title="Productivity Score" value="94.2 / 100" change={5.2} trend="up" subtitle="Sprint 25 velocity" icon={<Zap size={20} />} accentColor="purple" />
          <KPICard title="Employee Satisfaction" value="95.2 eNPS" change={3.0} trend="up" subtitle="Sprint morale" icon={<HeartHandshake size={20} />} accentColor="emerald" />
          <KPICard title="Open Requests" value="5 PR Reviews" change={-2.0} trend="down" subtitle="Avg turnaround: 1.2h" icon={<FileText size={20} />} accentColor="amber" />
          <KPICard title="Performance Rating" value="4.8 / 5.0" change={0.4} trend="up" subtitle="Deliverable quality" icon={<Star size={20} />} accentColor="amber" />
          <KPICard title="Attrition Risk" value="1.2% Low" change={-0.8} trend="down" subtitle="Zero team turnover" icon={<AlertTriangle size={20} />} accentColor="rose" />
        </div>

        {/* 2. Workforce Trend (Line Chart) & 3. Department Overview (Bar Chart) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WorkforceTrendLine />
          <DepartmentOverviewBar />
        </div>

        {/* 4. Attendance Analytics (Area Chart) & 5. Employee Distribution (Pie Chart) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceAnalyticsArea />
          <EmployeeDistributionPie />
        </div>

        {/* 6. Performance Analysis (Radar Chart) & 7. Salary Analytics (Bar Chart) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceRadar />
          <SalaryAnalyticsBar />
        </div>

        {/* 8. Attrition (Donut Chart) */}
        <div className="grid grid-cols-1 gap-6">
          <AttritionDonut />
        </div>

        {/* 9. Employee Table */}
        <EmployeeTable />

        <ExportReport title="Export Team Lead Sprint & Deliverables Report" />
      </div>
    </RoleGuard>
  );
};
