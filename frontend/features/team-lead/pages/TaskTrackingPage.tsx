import React from 'react';
import { Flame, CheckCircle2, Clock, AlertTriangle, Layers } from 'lucide-react';

export const TaskTrackingPage: React.FC = () => {
  const tasks = [
    { id: 'TASK-401', title: 'Implement ABAC Sensitivity Validator', assignee: 'Alex Mercer', priority: 'HIGH', status: 'IN_PROGRESS' },
    { id: 'TASK-402', title: 'Refactor Header Security Dropdown Scroll', assignee: 'Sarah Connor', priority: 'CRITICAL', status: 'COMPLETED' },
    { id: 'TASK-403', title: 'Audit Multi-level Route Guards', assignee: 'Marcus Vance', priority: 'MEDIUM', status: 'IN_PROGRESS' },
    { id: 'TASK-404', title: 'Q2 Performance Report Exporting API', assignee: 'Rachel Kim', priority: 'LOW', status: 'TODO' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <span className="badge badge-info mb-1">Sprint Management</span>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
            Team Task & Sprint Tracking Board
          </h1>
          <p className="text-xs text-slate-400">
            Track active engineering tasks, sprint deliverables, and backlog items.
          </p>
        </div>
      </div>

      {/* Task List */}
      <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
        <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Flame size={18} className="text-rose-400" /> Active Sprint Tasks
        </h3>

        <div className="space-y-3">
          {tasks.map((t) => (
            <div key={t.id} className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-between text-xs">
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
    </div>
  );
};
