import React, { useState } from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';
import { KPICard } from '../../../components/cards/KPICard';
import { AdvancedFilterBar } from '../../../shared/components/AdvancedFilterBar';
import { DrillDownModal, DrillDownData } from '../../../shared/components/DrillDownModal';

// Custom Team Lead Charts
import { AttendanceAnalyticsArea } from '../../analytics/charts/AttendanceAnalyticsArea';
import { PerformanceRadar } from '../../analytics/charts/PerformanceRadar';

import { Flame, GitPullRequest, Users, CheckCircle2, Zap, Clock, Star, FileText, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TeamLeadDashboard: React.FC = () => {
  const [drillDownData, setDrillDownData] = useState<DrillDownData | null>(null);

  const directReports = [
    { name: 'Alex Mercer', role: 'Full Stack Developer', task: 'ABAC Sensitivity Validator', velocity: '94%', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
    { name: 'Rachel Kim', role: 'Data Analyst', task: 'Q2 Attrition Prediction Model', velocity: '98%', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
    { name: 'Samantha Wu', role: 'HR Specialist', task: 'Engineering Recruiter Screening', velocity: '91%', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
  ];

  const sprintTasks = [
    { id: 'TASK-401', title: 'Implement ABAC Sensitivity Validator', assignee: 'Alex Mercer', priority: 'HIGH', status: 'IN_PROGRESS' },
    { id: 'TASK-402', title: 'Refactor Header Security Dropdown Scroll', assignee: 'Sarah Connor', priority: 'CRITICAL', status: 'COMPLETED' },
    { id: 'TASK-403', title: 'Audit Multi-level Route Guards', assignee: 'Marcus Vance', priority: 'MEDIUM', status: 'IN_PROGRESS' },
    { id: 'TASK-404', title: 'Fix Duplicate Manager Access Policies', assignee: 'David Sterling', priority: 'HIGH', status: 'COMPLETED' },
  ];

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
            <Link to="/team-lead/tasks" className="btn btn-primary btn-sm flex items-center gap-1.5 shadow-md">
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
              { label: 'Completed Points', value: 48 },
              { label: 'In Progress Points', value: 8 },
            ])}
          />
          <KPICard
            title="Daily Attendance"
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
              { label: 'PR #108', value: 'Alex Mercer' },
              { label: 'PR #109', value: 'Sarah Connor' },
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
            ])}
          />
        </div>

        {/* Section 1: Active Sprint Tasks & Direct Reporting Roster */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Flame size={18} className="text-rose-400" /> Active Sprint Task Board
              </h3>
              <Link to="/team-lead/tasks" className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1">
                View Board <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-2.5">
              {sprintTasks.map((t) => (
                <div key={t.id} className="p-3.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400">{t.id}</span>
                    <h4 className="font-bold text-sm text-[var(--text-primary)]">{t.title}</h4>
                    <p className="text-xs text-slate-400">Assignee: <span className="text-blue-400 font-semibold">{t.assignee}</span></p>
                  </div>
                  <span className={`badge ${t.status === 'COMPLETED' ? 'badge-success' : 'badge-info'} text-[10px] uppercase font-bold`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Users size={18} className="text-cyan-400" /> Direct Reports Roster & Velocity
              </h3>
              <Link to="/team-lead/members" className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1">
                View Roster <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-3">
              {directReports.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-full object-cover border border-cyan-500 shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm text-[var(--text-primary)]">{m.name}</h4>
                      <p className="text-[11px] text-slate-400">{m.task}</p>
                    </div>
                  </div>
                  <span className="badge badge-success text-[10px] font-bold">{m.velocity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Attendance Tracking Area Chart & Squad Skill Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Clock size={18} className="text-emerald-400" /> Team Attendance & Shift Hours Analytics
            </h3>
            <AttendanceAnalyticsArea />
          </div>

          <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Star size={18} className="text-purple-400" /> Squad Technical Capability Radar
            </h3>
            <PerformanceRadar />
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
