import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';
import { KPICard } from '../../../components/cards/KPICard';
import { AttendanceAnalyticsArea } from '../../analytics/charts/AttendanceAnalyticsArea';
import { Flame, GitPullRequest, Users, CheckCircle2, Zap, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TeamLeadDashboard: React.FC = () => {
  const directReports = [
    { name: 'Alex Mercer', role: 'Full Stack Developer', task: 'ABAC Sensitivity Validator', velocity: '94%', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
    { name: 'Rachel Kim', role: 'Data Analyst', task: 'Q2 Attrition Prediction Model', velocity: '98%', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
    { name: 'Samantha Wu', role: 'HR Specialist', task: 'Engineering Recruiter Screening', velocity: '91%', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
  ];

  const sprintTasks = [
    { id: 'TASK-401', title: 'Implement ABAC Sensitivity Validator', assignee: 'Alex Mercer', priority: 'HIGH', status: 'IN_PROGRESS' },
    { id: 'TASK-402', title: 'Refactor Header Security Dropdown Scroll', assignee: 'Sarah Connor', priority: 'CRITICAL', status: 'COMPLETED' },
    { id: 'TASK-403', title: 'Audit Multi-level Route Guards', assignee: 'Marcus Vance', priority: 'MEDIUM', status: 'IN_PROGRESS' },
  ];

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

        {/* Team Lead Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Direct Reports" value="6 Developers" change={0.0} trend="up" subtitle="Frontend Core Squad" icon={<Users size={20} />} accentColor="cyan" />
          <KPICard title="Sprint Completion" value="87% Complete" change={5.2} trend="up" subtitle="Sprint 24B target" icon={<Zap size={20} />} accentColor="amber" />
          <KPICard title="Daily Attendance" value="6 / 6 Present" change={0.0} trend="up" subtitle="100% On-duty today" icon={<Clock size={20} />} accentColor="emerald" />
          <KPICard title="Code Review Backlog" value="3 PRs Pending" change={-1.5} trend="down" subtitle="Avg turnaround 2h" icon={<CheckCircle2 size={20} />} accentColor="purple" />
        </div>

        {/* Team Lead Section 1: Active Sprint Tasks & Direct Reporting Roster */}
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

        {/* Team Lead Section 2: Attendance Tracking Area Chart */}
        <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Clock size={18} className="text-emerald-400" /> Team Attendance & Shift Hours Analytics
          </h3>
          <AttendanceAnalyticsArea />
        </div>
      </div>
    </RoleGuard>
  );
};
