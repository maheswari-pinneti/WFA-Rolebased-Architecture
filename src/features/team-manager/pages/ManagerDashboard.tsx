import React, { useState } from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';
import { KPICard } from '../../../components/cards/KPICard';
import { AdvancedFilterBar } from '../../../shared/components/AdvancedFilterBar';
import { DrillDownModal, DrillDownData } from '../../../shared/components/DrillDownModal';

// 6 Interactive Charts
import { WorkforceTrendLine } from '../../analytics/charts/WorkforceTrendLine';
import { DepartmentOverviewBar } from '../../analytics/charts/DepartmentOverviewBar';
import { AttendanceAnalyticsArea } from '../../analytics/charts/AttendanceAnalyticsArea';
import { EmployeeDistributionPie } from '../../analytics/charts/EmployeeDistributionPie';
import { PerformanceRadar } from '../../analytics/charts/PerformanceRadar';
import { SalaryAnalyticsBar } from '../../analytics/charts/SalaryAnalyticsBar';

import { Briefcase, Users, CheckCircle2, Clock, Zap, Star, HeartHandshake, FileText, AlertTriangle, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ManagerDashboard: React.FC = () => {
  const [drillDownData, setDrillDownData] = useState<DrillDownData | null>(null);

  const openDrillDown = (title: string, value: string | number, subtitle: string, details: { label: string; value: string | number }[]) => {
    setDrillDownData({
      title,
      metricValue: value,
      subtitle,
      category: 'Department Manager Scope',
      details,
    });
  };

  return (
    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR, Role.MANAGER]} requiredPermission={Permission.TEAM_ANALYTICS_VIEW}>
      <div className="space-y-6 animate-fadeIn">
        {/* Manager Header Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/50 via-slate-900 to-indigo-950/40 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center shrink-0">
              <Briefcase size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight text-white">Department Manager Workspace</h2>
                <span className="badge badge-manager">ENGINEERING SCOPE</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Resource allocation, sub-team sprint velocity, leave approvals & department throughput.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/manager/approvals" className="btn btn-primary btn-sm flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Leave Approvals
            </Link>
            <Link to="/manager/analytics" className="btn btn-secondary btn-sm flex items-center gap-1.5">
              <Zap size={14} /> Team Analytics
            </Link>
          </div>
        </div>

        {/* Advanced Filter Bar */}
        <AdvancedFilterBar onFilterChange={() => {}} />

        {/* 8 Reusable Manager KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Department Staff"
            value="24 Engineers"
            change={8.3}
            trend="up"
            subtitle="3 Active squads"
            icon={<Users size={20} />}
            accentColor="blue"
            onClick={() => openDrillDown('Department Roster Breakdown', '24 Engineers', 'Frontend, Backend, and QA sub-teams', [
              { label: 'Frontend Core Squad', value: 8 },
              { label: 'Backend API Squad', value: 10 },
              { label: 'QA Automation Squad', value: 6 },
            ])}
          />
          <KPICard
            title="Department Velocity"
            value="94.2 / 100"
            change={4.1}
            trend="up"
            subtitle="+4.1% over Q2 target"
            icon={<Zap size={20} />}
            accentColor="purple"
            onClick={() => openDrillDown('Department Sprint Velocity', '94.2 Score', 'Sprint story points delivered vs planned', [
              { label: 'Frontend Throughput', value: '96.5%' },
              { label: 'Backend Throughput', value: '92.8%' },
              { label: 'QA Coverage Rate', value: '94.0%' },
            ])}
          />
          <KPICard
            title="Pending Approvals"
            value="2 Requests"
            change={-1.0}
            trend="down"
            subtitle="Action required"
            icon={<Clock size={20} />}
            accentColor="amber"
            onClick={() => openDrillDown('Pending Department Approvals', '2 Requests', 'Team leave and expense authorization queue', [
              { label: 'Alex Mercer', value: 'Annual Leave (3 Days)' },
              { label: 'Samantha Wu', value: 'Equipment Expense ($450)' },
            ])}
          />
          <KPICard
            title="Team Morale"
            value="4.8 / 5.0"
            change={0.4}
            trend="up"
            subtitle="Q2 review score"
            icon={<Star size={20} />}
            accentColor="emerald"
            onClick={() => openDrillDown('Department Team Morale', '4.8 / 5.0 Rating', 'Monthly squad pulse survey rating', [
              { label: 'Work-Life Balance', value: '4.9 / 5.0' },
              { label: 'Peer Collaboration', value: '4.8 / 5.0' },
              { label: 'Tooling & Infra', value: '4.7 / 5.0' },
            ])}
          />
          <KPICard
            title="Attendance Compliance"
            value="98.2%"
            change={1.2}
            trend="up"
            subtitle="Shift presence"
            icon={<CheckCircle2 size={20} />}
            accentColor="cyan"
            onClick={() => openDrillDown('Shift Attendance Compliance', '98.2%', 'Department daily attendance rate', [
              { label: 'On-Duty Office', value: 18 },
              { label: 'Remote Duty', value: 5 },
              { label: 'On Vacation', value: 1 },
            ])}
          />
          <KPICard
            title="Completed Deliverables"
            value="42 Tasks"
            change={12.0}
            trend="up"
            subtitle="Sprint 24B target"
            icon={<FileText size={20} />}
            accentColor="emerald"
            onClick={() => openDrillDown('Completed Sprint Deliverables', '42 Tasks', 'Shipped feature modules and bug fixes', [
              { label: 'Feature Epics', value: 14 },
              { label: 'Bug Fixes', value: 22 },
              { label: 'Tech Debt PRs', value: 6 },
            ])}
          />
          <KPICard
            title="Team Budget Utilization"
            value="82.4%"
            change={-2.1}
            trend="neutral"
            subtitle="Q2 Budget health"
            icon={<Briefcase size={20} />}
            accentColor="purple"
            onClick={() => openDrillDown('Department Budget Utilization', '82.4%', 'Quarterly software & infrastructure spend', [
              { label: 'Cloud Servers (AWS)', value: '$12,400' },
              { label: 'SaaS Licensing', value: '$4,200' },
            ])}
          />
          <KPICard
            title="Attrition Risk"
            value="0.0% Low"
            change={0.0}
            trend="neutral"
            subtitle="Zero department churn"
            icon={<AlertTriangle size={20} />}
            accentColor="rose"
            onClick={() => openDrillDown('Department Retention Index', '0.0% Attrition', 'Predictive retention rating for department', [
              { label: 'Department Retention', value: '100%' },
              { label: 'High Performer Risk', value: 'Low' },
            ])}
          />
        </div>

        {/* 6 Distinct Interactive Charts Grid */}
        <div className="space-y-6">
          <h3 className="text-lg font-black tracking-tight text-[var(--text-primary)] flex items-center gap-2">
            <Activity size={20} className="text-blue-400" /> Department Performance & Velocity Analytics (6 Chart Dimensions)
          </h3>

          {/* Row 1: Line Chart & Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WorkforceTrendLine />
            <DepartmentOverviewBar />
          </div>

          {/* Row 2: Area Chart & Pie Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AttendanceAnalyticsArea />
            <EmployeeDistributionPie />
          </div>

          {/* Row 3: Radar Chart & Salary Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceRadar />
            <SalaryAnalyticsBar />
          </div>
        </div>

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
