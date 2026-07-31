import React, { useState } from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';
import { KPICard } from '../../../components/cards/KPICard';
import { DepartmentOverviewBar } from '../../analytics/charts/DepartmentOverviewBar';
import { PerformanceRadar } from '../../analytics/charts/PerformanceRadar';
import { Briefcase, Users, CheckCircle2, XCircle, Clock, Zap, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ManagerDashboard: React.FC = () => {
  const [approvals, setApprovals] = useState([
    { id: 'REQ-101', employee: 'Alex Mercer', type: 'Annual Leave Request', duration: '3 Days (Aug 5 - Aug 8)', reason: 'Family vacation', status: 'PENDING' },
    { id: 'REQ-102', employee: 'Samantha Wu', type: 'Equipment Expense', duration: '$450.00', reason: 'Ergonomic Chair & Monitor Arm', status: 'PENDING' },
  ]);

  const handleAction = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
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

        {/* Manager Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Department Staff" value="24 Engineers" change={8.3} trend="up" subtitle="3 Active squads" icon={<Users size={20} />} accentColor="blue" />
          <KPICard title="Department Velocity" value="94.2 / 100" change={4.1} trend="up" subtitle="+4.1% over Q2 target" icon={<Zap size={20} />} accentColor="purple" />
          <KPICard title="Pending Approvals" value={`${approvals.filter(a => a.status === 'PENDING').length} Items`} change={-1.0} trend="down" subtitle="Action required" icon={<Clock size={20} />} accentColor="amber" />
          <KPICard title="Department Morale" value="4.8 / 5.0" change={0.4} trend="up" subtitle="Q2 review score" icon={<Star size={20} />} accentColor="emerald" />
        </div>

        {/* Manager-Specific Section 1: Interactive Approval Action Desk */}
        <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Clock size={18} className="text-amber-400" /> Pending Team Leave & Request Approvals Desk
            </h3>
            <Link to="/manager/approvals" className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1">
              Approvals Center <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approvals.map((req) => (
              <div key={req.id} className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[var(--text-primary)]">{req.employee}</span>
                  <span className="badge badge-info text-[9px] uppercase">{req.type}</span>
                </div>
                <p className="text-xs text-slate-300">
                  <span className="font-semibold text-blue-400">{req.duration}</span> — {req.reason}
                </p>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-color)]">
                  {req.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => handleAction(req.id, 'APPROVED')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <CheckCircle2 size={14} /> Approve
                      </button>
                      <button
                        onClick={() => handleAction(req.id, 'REJECTED')}
                        className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 font-bold text-xs flex items-center gap-1.5 transition-all"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </>
                  ) : (
                    <span className={`badge ${req.status === 'APPROVED' ? 'badge-success' : 'badge-danger'} text-xs font-bold uppercase`}>
                      {req.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manager-Specific Section 2: Department Sub-Team Overview & Performance Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Zap size={18} className="text-indigo-400" /> Sub-Team Productive Output & Allocation
            </h3>
            <DepartmentOverviewBar />
          </div>

          <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Star size={18} className="text-purple-400" /> Department Skill Matrix & Radar Score
            </h3>
            <PerformanceRadar />
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};
