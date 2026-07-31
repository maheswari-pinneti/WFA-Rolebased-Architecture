import React, { useState } from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';
import { KPICard } from '../../../components/cards/KPICard';
import { AdvancedFilterBar } from '../../../shared/components/AdvancedFilterBar';
import { DrillDownModal, DrillDownData } from '../../../shared/components/DrillDownModal';
import { EmployeeTable } from '../../../components/tables/EmployeeTable';

// Custom Admin Charts & Components
import { DepartmentDistribution } from '../../analytics/charts/DepartmentDistribution';
import { auditLogger } from '../../../security/audit/auditLogger';

import { ShieldCheck, Users, Lock, History, Sliders, CheckCircle2, ShieldAlert, Activity, Server, Cpu, HardDrive, Database, ArrowRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const [drillDownData, setDrillDownData] = useState<DrillDownData | null>(null);
  const auditLogs = auditLogger.getLogs();

  const openDrillDown = (title: string, value: string | number, subtitle: string, details: { label: string; value: string | number }[]) => {
    setDrillDownData({
      title,
      metricValue: value,
      subtitle,
      category: 'System Admin Governance',
      details,
    });
  };

  const systemServices = [
    { name: 'API Gateway (Kong Cluster)', status: 'HEALTHY', latency: '12ms', load: '24%' },
    { name: 'PostgreSQL Primary DB', status: 'HEALTHY', latency: '4ms', load: '42%' },
    { name: 'Redis Cache Cluster', status: 'HEALTHY', latency: '1ms', load: '18%' },
    { name: 'Kafka Audit Event Bus', status: 'HEALTHY', latency: '8ms', load: '31%' },
  ];

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
                <span className="badge badge-admin">LEVEL 0 FULL CONTROL</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Full platform architecture control, security governance, user management, and global audit stream.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/admin/users" className="btn btn-primary btn-sm flex items-center gap-1.5 shadow-md">
              <Users size={14} /> Manage Users
            </Link>
            <Link to="/admin/roles" className="btn btn-secondary btn-sm flex items-center gap-1.5">
              <Lock size={14} /> Security Policies
            </Link>
          </div>
        </div>

        {/* Advanced Filter Bar */}
        <AdvancedFilterBar onFilterChange={() => {}} />

        {/* 8 System Admin Reusable KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Global Users"
            value="301 Accounts"
            change={8.4}
            trend="up"
            subtitle="Across 6 departments"
            icon={<Users size={20} />}
            accentColor="blue"
            onClick={() => openDrillDown('Global User Accounts', '301 Accounts', 'Full organization account registry', [
              { label: 'System Admins', value: 4 },
              { label: 'HR Managers', value: 12 },
              { label: 'Department Managers', value: 28 },
              { label: 'Employees', value: 257 },
            ])}
          />
          <KPICard
            title="Security Policies"
            value="13 Role Scopes"
            change={0.0}
            trend="neutral"
            subtitle="Strict RBAC active"
            icon={<Lock size={20} />}
            accentColor="purple"
            onClick={() => openDrillDown('Security Policies Matrix', '13 Active Rules', 'RBAC & ABAC policy configuration', [
              { label: 'Level 0 Admins', value: 'Full Access' },
              { label: 'Level 1 HR', value: 'Org Scope' },
              { label: 'Level 2 Managers', value: 'Dept Scope' },
            ])}
          />
          <KPICard
            title="Platform SLA Uptime"
            value="99.98%"
            change={0.2}
            trend="up"
            subtitle="Zero downtime Q2"
            icon={<Server size={20} />}
            accentColor="emerald"
            onClick={() => openDrillDown('Infrastructure Uptime SLA', '99.98%', 'API Gateway & DB Cluster availability', [
              { label: 'API Gateway', value: '99.99%' },
              { label: 'PostgreSQL DB', value: '100.0%' },
            ])}
          />
          <KPICard
            title="Audit Log Events"
            value={`${auditLogs.length} Events`}
            change={12.5}
            trend="up"
            subtitle="Real-time security stream"
            icon={<History size={20} />}
            accentColor="amber"
            onClick={() => openDrillDown('Security Audit Event Stream', `${auditLogs.length} Events`, 'SOC2 compliance event log', [
              { label: 'Granted Actions', value: 13950 },
              { label: 'Denied Attempts', value: 330 },
            ])}
          />
          <KPICard
            title="Active Workforce"
            value="284 Active"
            change={2.1}
            trend="up"
            subtitle="Currently on shift"
            icon={<Activity size={20} />}
            accentColor="cyan"
            onClick={() => openDrillDown('Active Shift Roster', '284 Active', 'Real-time employee clock-in roster', [
              { label: 'On-site HQ', value: 180 },
              { label: 'Remote Duty', value: 104 },
            ])}
          />
          <KPICard
            title="API Rate Limits"
            value="10,000 / min"
            change={4.0}
            trend="up"
            subtitle="Peak capacity 18%"
            icon={<Sliders size={20} />}
            accentColor="purple"
            onClick={() => openDrillDown('API Rate Limits', '10,000 req/min', 'Global API Gateway rate limiting', [
              { label: 'Auth Endpoint', value: '1,200 req/m' },
              { label: 'Data Queries', value: '4,800 req/m' },
            ])}
          />
          <KPICard
            title="System Health"
            value="98.5% Score"
            change={1.0}
            trend="up"
            subtitle="Optimal benchmark"
            icon={<CheckCircle2 size={20} />}
            accentColor="emerald"
            onClick={() => openDrillDown('System Health Score', '98.5%', 'Hardware and memory resource score', [
              { label: 'RAM Utilization', value: '34.2%' },
              { label: 'CPU Core Load', value: '28.1%' },
            ])}
          />
          <KPICard
            title="Flagged Security Alerts"
            value="0 Critical"
            change={-100}
            trend="down"
            subtitle="Firewall protected"
            icon={<ShieldAlert size={20} />}
            accentColor="rose"
            onClick={() => openDrillDown('Security Threat Monitor', '0 Critical Threat Alerts', 'Intrusion detection & WAF status', [
              { label: 'WAF Firewall', value: 'Active' },
              { label: 'DDoS Mitigated', value: '100%' },
            ])}
          />
        </div>

        {/* Section 1: Security Audit Stream & Infrastructure Hardware Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Audit Stream */}
          <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <History size={18} className="text-amber-400" /> System Audit Event Stream (Real-Time)
              </h3>
              <Link to="/admin/audit-logs" className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1">
                View Log <ArrowRight size={12} />
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

          {/* Infrastructure Health */}
          <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Server size={18} className="text-emerald-400" /> Platform Infrastructure Hardware Status
              </h3>
              <span className="badge badge-success text-[10px] uppercase font-mono font-bold">OPERATIONAL</span>
            </div>

            <div className="space-y-3">
              {systemServices.map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <Database size={16} className="text-blue-400 shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm text-[var(--text-primary)]">{s.name}</h4>
                      <p className="text-[11px] text-slate-400">Latency: <span className="text-emerald-400 font-semibold">{s.latency}</span> • Load: {s.load}</p>
                    </div>
                  </div>
                  <span className="badge badge-success text-[10px] font-bold">{s.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Global Department Distribution Chart */}
        <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Users size={18} className="text-purple-400" /> Global Department Distribution & Headcount Allocation
          </h3>
          <DepartmentDistribution />
        </div>

        {/* Section 3: Global Employee Directory */}
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
