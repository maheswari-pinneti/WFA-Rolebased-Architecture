import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';
import { KPICard } from '../../../components/cards/KPICard';
import { EmployeeTable } from '../../../components/tables/EmployeeTable';
import { DepartmentDistribution } from '../../analytics/charts/DepartmentDistribution';
import { auditLogger } from '../../../security/audit/auditLogger';
import { ShieldCheck, Users, Lock, History, Sliders, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const auditLogs = auditLogger.getLogs();

  return (
    <RoleGuard allowedRoles={[Role.ADMIN]} requiredPermission={Permission.SYSTEM_CONFIG}>
      <div className="space-y-6 animate-fadeIn">
        {/* Admin Header Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-950 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center shrink-0">
              <ShieldCheck size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight text-white">System Administrator Console</h2>
                <span className="badge badge-admin">LEVEL 0 ACCESS</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Full platform architecture control, security governance, user management, and global audit stream.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/admin/users" className="btn btn-primary btn-sm flex items-center gap-1.5">
              <Users size={14} /> Manage Users
            </Link>
            <Link to="/admin/roles" className="btn btn-secondary btn-sm flex items-center gap-1.5">
              <Lock size={14} /> Role Policies
            </Link>
          </div>
        </div>

        {/* Admin Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Global Users" value="301 Accounts" change={8.4} trend="up" subtitle="Across 6 departments" icon={<Users size={20} />} accentColor="blue" />
          <KPICard title="Security Policies" value="13 Role Scopes" change={0.0} trend="up" subtitle="Strict RBAC active" icon={<Lock size={20} />} accentColor="purple" />
          <KPICard title="Platform SLA Uptime" value="99.98%" change={0.2} trend="up" subtitle="Zero downtime Q2" icon={<CheckCircle2 size={20} />} accentColor="emerald" />
          <KPICard title="Audit Stream Logs" value={`${auditLogs.length} Events`} change={12.5} trend="up" subtitle="Real-time security logs" icon={<History size={20} />} accentColor="amber" />
        </div>

        {/* Admin-Specific Section 1: Security Audit Log Stream & Department Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <History size={18} className="text-amber-400" /> Real-time System Security Audit Stream
              </h3>
              <Link to="/admin/audit-logs" className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1">
                View All <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-2.5">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {log.status === 'SUCCESS' ? <CheckCircle2 size={14} /> : <ShieldAlert size={14} />}
                    </div>
                    <div>
                      <p className="font-bold text-[var(--text-primary)]">{log.action}</p>
                      <p className="text-[11px] text-slate-400">{log.details}</p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Users size={18} className="text-blue-500" /> Global Organization Department Distribution
            </h3>
            <DepartmentDistribution />
          </div>
        </div>

        {/* Admin-Specific Section 2: Global Employee Master Directory */}
        <EmployeeTable />
      </div>
    </RoleGuard>
  );
};
