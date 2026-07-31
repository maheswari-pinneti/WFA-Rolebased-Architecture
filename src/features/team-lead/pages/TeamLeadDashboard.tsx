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

import { Flame, GitPullRequest, Users, CheckCircle2, Zap, Clock, Star, FileText, AlertTriangle, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TeamLeadDashboard: React.FC = () => {
  const [drillDownData, setDrillDownData] = useState<DrillDownData | null>(null);

  const openDrillDown = (title: string, value: string | number, subtitle: string, details: { label: string; value: string | number }[]) => {
    setDrillDownData({
      title,
      metricValue: value,
      subtitle,
      category: 'Team Lead Scope',
      details,
    });
  };

  return (
    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR, Role.MANAGER, Role.TEAM_LEAD]} requiredPermission={Permission.TEAM_ANALYTICS_VIEW}>
      <div className="space-y-6 animate-fadeIn">
        {/* Team Lead Header Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-950/50 via-slate-900 to-cyan-950/40 border border-teal-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center shrink-0">
              <GitPullRequest size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight text-white">Team Lead Operational Command</h2>
                <span className="badge badge-lead">FRONTEND SQUAD</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Direct reports tracking, sprint task velocity, daily attendance tracking & developer feedback.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/team-lead/tasks" className="btn btn-primary btn-sm flex items-center gap-1.5">
              <Flame size={14} /> Sprint Tasks
            </Link>
            <Link to="/team-lead/members" className="btn btn-secondary btn-sm flex items-center gap-1.5">
              <Users size={14} /> Team Roster
            </Link>
          </div>
        </div>

        {/* Advanced Filter Bar */}
        <AdvancedFilterBar onFilterChange={() => {}} />

        {/* 8 Reusable Team Lead KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Direct Reports"
            value="6 Developers"
            change={0.0}
            trend="neutral"
            subtitle="Frontend Core Squad"
            icon={<Users size={20} />}
            accentColor="cyan"
            onClick={() => openDrillDown('Direct Reports Roster', '6 Developers', 'Active squad developers and assigned roles', [
              { label: 'Alex Mercer', value: 'Full Stack Developer' },
              { label: 'Rachel Kim', value: 'Data Analyst' },
              { label: 'Samantha Wu', value: 'HR Specialist' },
            ])}
          />
          <KPICard
            title="Sprint Completion"
            value="87% Complete"
            change={5.2}
            trend="up"
            subtitle="Sprint 24B target"
            icon={<Zap size={20} />}
            accentColor="amber"
            onClick={() => openDrillDown('Sprint 24B Story Points', '87% Complete', 'Current sprint burn-down status', [
              { label: 'Completed Story Points', value: 48 },
              { label: 'In Progress Points', value: 8 },
              { label: 'Remaining Backlog', value: 4 },
            ])}
          />
          <KPICard
            title="Daily Squad Attendance"
            value="6 / 6 Present"
            change={0.0}
            trend="up"
            subtitle="100% On-duty today"
            icon={<Clock size={20} />}
            accentColor="emerald"
            onClick={() => openDrillDown('Daily Squad Attendance', '6 / 6 Present', 'Shift presence for Frontend Squad', [
              { label: 'Office Duty', value: 4 },
              { label: 'Remote Shift', value: 2 },
            ])}
          />
          <KPICard
            title="Code Review Backlog"
            value="3 PRs Pending"
            change={-1.5}
            trend="down"
            subtitle="Avg turnaround 2h"
            icon={<CheckCircle2 size={20} />}
            accentColor="purple"
            onClick={() => openDrillDown('Code Review PR Queue', '3 PRs Pending', 'Pull requests waiting for TL review', [
              { label: 'PR #108 (ABAC Engine)', value: 'Alex Mercer' },
              { label: 'PR #109 (Header Scroll)', value: 'Sarah Connor' },
            ])}
          />
          <KPICard
            title="Velocity Points"
            value="56 Story Pts"
            change={8.0}
            trend="up"
            subtitle="Sprint target 60"
            icon={<Flame size={20} />}
            accentColor="rose"
            onClick={() => openDrillDown('Sprint Velocity Metrics', '56 Story Pts', 'Bi-weekly story point delivery history', [
              { label: 'Sprint 24A Velocity', value: 52 },
              { label: 'Sprint 24B Velocity', value: 56 },
            ])}
          />
          <KPICard
            title="Squad Rating"
            value="4.9 / 5.0"
            change={0.2}
            trend="up"
            subtitle="Highest team output"
            icon={<Star size={20} />}
            accentColor="emerald"
            onClick={() => openDrillDown('Squad Code Quality Rating', '4.9 / 5.0', 'Code quality and test coverage benchmark', [
              { label: 'Unit Test Coverage', value: '94.2%' },
              { label: 'Zero Critical Bugs', value: 'Pass' },
            ])}
          />
          <KPICard
            title="Active Tasks"
            value="12 In Progress"
            change={2.0}
            trend="up"
            subtitle="Assignees active"
            icon={<FileText size={20} />}
            accentColor="blue"
            onClick={() => openDrillDown('Active Task Allocations', '12 Active Tasks', 'Sprint Kanban active columns', [
              { label: 'In Progress', value: 7 },
              { label: 'Under Review', value: 3 },
              { label: 'Blocked Items', value: 2 },
            ])}
          />
          <KPICard
            title="Sprint Blockers"
            value="0 Blockers"
            change={-100}
            trend="down"
            subtitle="Clear execution path"
            icon={<AlertTriangle size={20} />}
            accentColor="cyan"
            onClick={() => openDrillDown('Sprint Blocker Log', '0 Active Blockers', 'Dependency & blocker resolution log', [
              { label: 'Infra Dependencies', value: 'Resolved' },
              { label: 'API Contract Sync', value: 'Synced' },
            ])}
          />
        </div>

        {/* 6 Distinct Interactive Charts Grid */}
        <div className="space-y-6">
          <h3 className="text-lg font-black tracking-tight text-[var(--text-primary)] flex items-center gap-2">
            <Activity size={20} className="text-teal-400" /> Squad Sprint & Operational Analytics (6 Chart Dimensions)
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
