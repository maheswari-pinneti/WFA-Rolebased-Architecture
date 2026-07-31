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
import { Users, UserCheck, ShieldCheck, Zap, HeartHandshake, FileText, Star, AlertTriangle } from 'lucide-react';

export const HRDashboard: React.FC = () => {
  return (
    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR]} requiredPermission={Permission.EMPLOYEE_READ}>
      <div className="space-y-6">
        {/* HR Header Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/40 border border-purple-500/30 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center shrink-0">
              <UserCheck size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight text-white">Stackly HR Operations Manager Portal</h2>
                <span className="badge badge-hr">WORKFORCE LIFECYCLE</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">Workforce headcount, attendance monitoring, performance reviews & salary analytics</p>
            </div>
          </div>
        </div>

        {/* 1. KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Total Employees" value="1,248" change={8.4} trend="up" subtitle="Global workforce" icon={<Users size={20} />} accentColor="purple" />
          <KPICard title="Active Workforce" value="1,180 (94.5%)" change={2.1} trend="up" subtitle="Shift active today" icon={<UserCheck size={20} />} accentColor="emerald" />
          <KPICard title="Attendance Rate" value="98.2%" change={1.2} trend="up" subtitle="Monthly average" icon={<ShieldCheck size={20} />} accentColor="cyan" />
          <KPICard title="Productivity Score" value="94.2 / 100" change={4.1} trend="up" subtitle="Department score" icon={<Zap size={20} />} accentColor="blue" />
          <KPICard title="Employee Satisfaction" value="95.2 eNPS" change={3.0} trend="up" subtitle="Satisfaction index" icon={<HeartHandshake size={20} />} accentColor="emerald" />
          <KPICard title="Open Requests" value="14 Pending" change={-2.4} trend="down" subtitle="Leave & PTO queue" icon={<FileText size={20} />} accentColor="amber" />
          <KPICard title="Performance Rating" value="4.8 / 5.0" change={0.4} trend="up" subtitle="Q2 Review Average" icon={<Star size={20} />} accentColor="amber" />
          <KPICard title="Attrition Risk" value="1.2% Low" change={-0.8} trend="down" subtitle="Top retention" icon={<AlertTriangle size={20} />} accentColor="rose" />
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

        <ExportReport title="Export HR Operations & Payroll Reports" />
      </div>
    </RoleGuard>
  );
};
