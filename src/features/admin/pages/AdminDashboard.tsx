import React, { useState } from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';
import { KPICard } from '../../../components/cards/KPICard';
import { AdvancedFilterBar, FilterState } from '../../../shared/components/AdvancedFilterBar';
import { DrillDownModal, DrillDownData } from '../../../shared/components/DrillDownModal';

// 6 Interactive Charts
import { WorkforceTrendLine } from '../../analytics/charts/WorkforceTrendLine';
import { DepartmentOverviewBar } from '../../analytics/charts/DepartmentOverviewBar';
import { AttendanceAnalyticsArea } from '../../analytics/charts/AttendanceAnalyticsArea';
import { EmployeeDistributionPie } from '../../analytics/charts/EmployeeDistributionPie';
import { PerformanceRadar } from '../../analytics/charts/PerformanceRadar';
import { SalaryAnalyticsBar } from '../../analytics/charts/SalaryAnalyticsBar';

import { ShieldCheck, Users, Lock, History, Sliders, CheckCircle2, ShieldAlert, Activity, FileSpreadsheet, Server } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const [drillDownData, setDrillDownData] = useState<DrillDownData | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All Active Data');

  const openDrillDown = (title: string, value: string | number, subtitle: string, details: { label: string; value: string | number }[]) => {
    setDrillDownData({
      title,
      metricValue: value,
      subtitle,
      category: 'System Admin Scope',
      details,
    });
  };

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

        {/* Advanced Filter Bar */}
        <AdvancedFilterBar onFilterChange={(f) => setActiveFilter(`${f.department} • ${f.dateRange}`)} />

        {/* 8 Reusable KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Global Users"
            value="301 Accounts"
            change={8.4}
            trend="up"
            subtitle="Across 6 departments"
            icon={<Users size={20} />}
            accentColor="blue"
            onClick={() => openDrillDown('Global Users Breakdown', '301 Accounts', 'Full organization active user directory', [
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
            onClick={() => openDrillDown('Security Policies Matrix', '13 Active Rules', 'Configured security clearance & ABAC rules', [
              { label: 'Level 0 Admins', value: 'Full Control' },
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
            onClick={() => openDrillDown('Infrastructure Uptime SLA', '99.98%', 'API gateway & DB replication uptime log', [
              { label: 'API Gateway', value: '99.99%' },
              { label: 'Database Cluster', value: '100.0%' },
              { label: 'Event Bus', value: '99.95%' },
            ])}
          />
          <KPICard
            title="Audit Log Events"
            value="14,280 Logs"
            change={12.5}
            trend="up"
            subtitle="Real-time security logs"
            icon={<History size={20} />}
            accentColor="amber"
            onClick={() => openDrillDown('Security Audit Logs Stream', '14,280 Logs', 'SOC2 immutable security event log', [
              { label: 'Access Grants', value: 13950 },
              { label: 'Denied Attempts', value: 330 },
              { label: 'Flagged Alerts', value: 0 },
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
            onClick={() => openDrillDown('Active Shift Workforce', '284 Active', 'On-duty employee attendance roster', [
              { label: 'On-site Office', value: 180 },
              { label: 'Remote Shift', value: 104 },
              { label: 'On PTO / Leave', value: 17 },
            ])}
          />
          <KPICard
            title="API Rate Limits"
            value="10,000 / min"
            change={4.0}
            trend="up"
            subtitle="Peak load 18%"
            icon={<Sliders size={20} />}
            accentColor="purple"
            onClick={() => openDrillDown('API Rate Limit Monitor', '10,000 req/min', 'Global API Gateway throughput', [
              { label: 'Authentication API', value: '1,200 req/m' },
              { label: 'Analytics Query API', value: '4,800 req/m' },
            ])}
          />
          <KPICard
            title="System Health"
            value="98.5% Score"
            change={1.0}
            trend="up"
            subtitle="Optimal performance"
            icon={<CheckCircle2 size={20} />}
            accentColor="emerald"
            onClick={() => openDrillDown('System Health Benchmark', '98.5%', 'Overall platform stability index', [
              { label: 'Memory Usage', value: '34.2%' },
              { label: 'CPU Utilization', value: '28.1%' },
            ])}
          />
          <KPICard
            title="Flagged Alerts"
            value="0 Critical"
            change={-100}
            trend="down"
            subtitle="Zero security breaches"
            icon={<ShieldAlert size={20} />}
            accentColor="rose"
            onClick={() => openDrillDown('Security Threat Monitor', '0 Critical Threats', 'Intrusion detection & firewall status', [
              { label: 'Firewall Status', value: 'Protected' },
              { label: 'DDoS Mitigated', value: '100%' },
            ])}
          />
        </div>

        {/* 6 Distinct Interactive Charts Grid */}
        <div className="space-y-6">
          <h3 className="text-lg font-black tracking-tight text-[var(--text-primary)] flex items-center gap-2">
            <Activity size={20} className="text-blue-500" /> Platform Infrastructure & Workforce Analytics (6 Chart Dimensions)
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
