import React, { useState } from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';
import { KPICard } from '../../../components/cards/KPICard';
import { AdvancedFilterBar } from '../../../shared/components/AdvancedFilterBar';
import { DrillDownModal, DrillDownData } from '../../../shared/components/DrillDownModal';

// Interactive SVG Recharts
import { WorkforceGrowthLine } from '../../analytics/charts/WorkforceGrowthLine';
import { DepartmentDistribution } from '../../analytics/charts/DepartmentDistribution';
import { AttendanceOverviewBar } from '../../analytics/charts/AttendanceOverviewBar';
import { PerformanceAreaChart } from '../../analytics/charts/PerformanceAreaChart';

import {
  ShieldCheck,
  Users,
  Lock,
  UserPlus,
  Clock,
  FileSpreadsheet,
  Building2,
  MapPin,
  TrendingUp,
  Award,
  Calendar,
  Gift,
  PartyPopper,
  CheckCircle2,
  Activity,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const [drillDownData, setDrillDownData] = useState<DrillDownData | null>(null);

  const openDrillDown = (title: string, value: string | number, subtitle: string, details: { label: string; value: string | number }[]) => {
    setDrillDownData({
      title,
      metricValue: value,
      subtitle,
      category: 'Stackly Enterprise Analytics',
      details,
    });
  };

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <RoleGuard allowedRoles={[Role.ADMIN]} requiredPermission={Permission.SYSTEM_CONFIG}>
      <div className="space-y-6 animate-fadeIn font-sans">
        {/* Morning Greeting & Quick Actions Header */}
        <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 text-white border border-blue-500/30 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold backdrop-blur-md border border-white/20">
              <Calendar size={14} className="text-blue-300" /> {currentDateFormatted}
            </div>
            <h2 className="text-2xl lg:text-3xl font-black tracking-tight">
              Good Morning, John
            </h2>
            <p className="text-xs text-blue-100 font-medium">
              Department: <span className="font-bold text-white">Executive Governance</span> • Role: <span className="font-bold text-amber-300">System Administrator</span>
            </p>
          </div>

          {/* Quick Actions Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 z-10">
            <Link to="/admin/employees" className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2">
              <UserPlus size={16} /> Add Employee
            </Link>
            <Link to="/hr/attendance" className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold border border-white/20 backdrop-blur-md transition-all flex items-center gap-2">
              <Clock size={16} /> View Attendance
            </Link>
            <Link to="/admin/analytics" className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2">
              <FileSpreadsheet size={16} /> Generate Report
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <AdvancedFilterBar onFilterChange={() => {}} />

        {/* 8 Modern Enterprise KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Employees"
            value="1,248"
            change={12.4}
            trend="up"
            subtitle="Global enterprise workforce"
            icon={<Users size={20} />}
            accentColor="blue"
            onClick={() => openDrillDown('Total Employee Roster', '1,248 Employees', 'Active organizational headcount', [
              { label: 'Full-time Permanent', value: 1080 },
              { label: 'Contractors', value: 168 },
            ])}
          />
          <KPICard
            title="Active Employees"
            value="1,210"
            change={97.0}
            trend="up"
            subtitle="Currently online & clocked in"
            icon={<ShieldCheck size={20} />}
            accentColor="emerald"
            onClick={() => openDrillDown('Active Duty Status', '1,210 Active', 'Real-time clock-in roster', [
              { label: 'In-Office', value: 920 },
              { label: 'Remote WFH', value: 290 },
            ])}
          />
          <KPICard
            title="New Joiners"
            value="42"
            change={15.2}
            trend="up"
            subtitle="Joined in last 30 days"
            icon={<UserPlus size={20} />}
            accentColor="purple"
            onClick={() => openDrillDown('New Hires Onboarding', '42 New Joiners', 'Recent onboarding cohort', [
              { label: 'Engineering', value: 18 },
              { label: 'Sales & Growth', value: 14 },
              { label: 'Product & Design', value: 10 },
            ])}
          />
          <KPICard
            title="Attendance Rate"
            value="96.8%"
            change={1.2}
            trend="up"
            subtitle="Weekly enterprise average"
            icon={<Clock size={20} />}
            accentColor="amber"
            onClick={() => openDrillDown('Attendance Compliance', '96.8%', 'Weekly shift adherence', [
              { label: 'On-Time Clock Ins', value: '94.2%' },
              { label: 'Authorized WFH', value: '2.6%' },
            ])}
          />
          <KPICard
            title="Performance Score"
            value="94.2 / 100"
            change={3.8}
            trend="up"
            subtitle="Quarterly KPI rating"
            icon={<Award size={20} />}
            accentColor="blue"
            onClick={() => openDrillDown('Performance Metric Rating', '94.2 Score', 'Enterprise KPI score', [
              { label: 'Exceeding Target', value: '62%' },
              { label: 'Meeting Target', value: '34%' },
            ])}
          />
          <KPICard
            title="Departments"
            value="12 Divisions"
            change={0.0}
            trend="neutral"
            subtitle="Active functional units"
            icon={<Building2 size={20} />}
            accentColor="purple"
            onClick={() => openDrillDown('Department Breakdown', '12 Divisions', 'Organizational structure', [
              { label: 'Engineering', value: '450 Staff' },
              { label: 'Sales & Growth', value: '320 Staff' },
            ])}
          />
          <KPICard
            title="Locations"
            value="8 Offices"
            change={2.0}
            trend="up"
            subtitle="Global tech campuses"
            icon={<MapPin size={20} />}
            accentColor="emerald"
            onClick={() => openDrillDown('Global Campus Locations', '8 Sites', 'Office locations', [
              { label: 'New York HQ', value: '520 Staff' },
              { label: 'London Office', value: '310 Staff' },
            ])}
          />
          <KPICard
            title="Employee Growth"
            value="+27.3%"
            change={4.5}
            trend="up"
            subtitle="Year-over-year scaling"
            icon={<TrendingUp size={20} />}
            accentColor="amber"
            onClick={() => openDrillDown('YoY Headcount Scaling', '+27.3%', 'Annual growth trend', [
              { label: 'Q1 Growth', value: '+8.2%' },
              { label: 'Q2 Growth', value: '+19.1%' },
            ])}
          />
        </div>

        {/* 4 Interactive SVG Recharts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WorkforceGrowthLine />
          <DepartmentDistribution />
          <AttendanceOverviewBar />
          <PerformanceAreaChart />
        </div>

        {/* Recent Activity Timeline & Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity Timeline */}
          <div className="lg:col-span-2 glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h3 className="text-base font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                <Activity size={18} className="text-blue-500" /> Recent Enterprise Activity
              </h3>
              <Link to="/admin/audit-logs" className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1">
                Audit Log Stream <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { title: 'New employee joined Engineering team', time: '10m ago', user: 'Alex Mercer', badge: 'Onboarding', color: 'text-emerald-500 bg-emerald-500/10' },
                { title: 'Attendance marked for 1,210 employees', time: '1h ago', user: 'System Automated', badge: 'Attendance', color: 'text-blue-500 bg-blue-500/10' },
                { title: 'Leave request approved for Sarah Connor', time: '2h ago', user: 'Elena Rostova (HR)', badge: 'Approval', color: 'text-purple-500 bg-purple-500/10' },
                { title: 'Quarterly Performance KPI scores updated', time: '3h ago', user: 'David Sterling', badge: 'Performance', color: 'text-amber-500 bg-amber-500/10' },
                { title: 'Role security permission matrix modified', time: '5h ago', user: 'System Admin', badge: 'Security', color: 'text-rose-500 bg-rose-500/10' },
              ].map((act, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-between transition-all hover:scale-[1.01]">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                    <div>
                      <p className="font-bold text-[var(--text-primary)]">{act.title}</p>
                      <p className="text-[10px] text-slate-400">By {act.user}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${act.color}`}>{act.badge}</span>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Section: Birthdays, Anniversaries & Events */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-base font-extrabold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3 flex items-center gap-2">
              <Calendar size={18} className="text-purple-500" /> Upcoming Celebrations
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-3">
                <Gift size={20} className="text-purple-400 shrink-0" />
                <div>
                  <p className="font-bold text-[var(--text-primary)]">Sarah Connor's Birthday</p>
                  <p className="text-[10px] text-slate-400">Tomorrow • Product Team</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
                <PartyPopper size={20} className="text-amber-400 shrink-0" />
                <div>
                  <p className="font-bold text-[var(--text-primary)]">David Sterling's 5th Work Anniversary</p>
                  <p className="text-[10px] text-slate-400">Friday • Engineering Dept</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-3">
                <Calendar size={20} className="text-blue-400 shrink-0" />
                <div>
                  <p className="font-bold text-[var(--text-primary)]">All-Hands Company Town Hall</p>
                  <p className="text-[10px] text-slate-400">Aug 15, 2026 • Main Auditorium</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Drill Down Modal */}
        <DrillDownModal data={drillDownData} onClose={() => setDrillDownData(null)} />
      </div>
    </RoleGuard>
  );
};
