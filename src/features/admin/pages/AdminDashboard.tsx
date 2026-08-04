import React, { useState } from 'react';
import { useAuth } from '../../../auth/hooks/useAuth';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';
import { AdvancedFilterBar } from '../../../shared/components/AdvancedFilterBar';
import { DrillDownModal, DrillDownData } from '../../../shared/components/DrillDownModal';

// Recharts Modules
import { WorkforceGrowthLine } from '../../analytics/charts/WorkforceGrowthLine';
import { DepartmentDistribution } from '../../analytics/charts/DepartmentDistribution';
import { AttendanceAnalysisArea } from '../../analytics/charts/AttendanceAnalysisArea';
import { PerformanceAreaChart } from '../../analytics/charts/PerformanceAreaChart';
import { AttendanceOverviewBar } from '../../analytics/charts/AttendanceOverviewBar';
import { SalaryAnalyticsStackedBar } from '../../analytics/charts/SalaryAnalyticsStackedBar';
import { EmployeeEngagementRadar } from '../../analytics/charts/EmployeeEngagementRadar';

import {
  Users,
  UserPlus,
  Clock,
  FileSpreadsheet,
  Building2,
  TrendingUp,
  Award,
  Calendar,
  Gift,
  PartyPopper,
  CheckCircle2,
  Activity,
  ArrowRight,
  TrendingDown,
  Briefcase,
  Target,
  Eye,
  ShoppingCart,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [drillDownData, setDrillDownData] = useState<DrillDownData | null>(null);
  const [timeRange, setTimeRange] = useState<'Day' | 'Week' | 'Month'>('Month');

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'Maheswari';

  return (
    <RoleGuard allowedRoles={[Role.ADMIN]} requiredPermission={Permission.SYSTEM_CONFIG}>
      <div className="space-y-6 animate-fadeIn font-sans pb-10">
        
        {/* TailAdmin Hero Greeting Banner */}
        <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-950 text-white border border-blue-500/30 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-xs font-bold backdrop-blur-md border border-white/20">
              <Calendar size={14} className="text-blue-300" /> {currentDateFormatted}
            </div>
            <h2 className="text-2xl lg:text-3xl font-black tracking-tight">
              {getGreeting()}, {firstName} 👋
            </h2>
            <p className="text-xs text-blue-100 font-medium">
              Department: <span className="font-bold text-white">{user?.department || 'Executive Governance'}</span> • Role: <span className="font-bold text-amber-300">System Administrator</span>
            </p>
          </div>

          {/* Quick Actions Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 z-10">
            <Link to="/employees#add" className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2">
              <UserPlus size={16} /> Add Employee
            </Link>
            <Link to="/attendance" className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold border border-white/20 backdrop-blur-md transition-all flex items-center gap-2">
              <Clock size={16} /> View Attendance
            </Link>
            <Link to="/reports" className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2">
              <FileSpreadsheet size={16} /> Generate Report
            </Link>
          </div>
        </div>

        {/* Global Filter Bar */}
        <AdvancedFilterBar onFilterChange={() => {}} />

        {/* TAILADMIN STYLE TOP 4 KPI METRIC CARDS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          
          {/* Card 1: Total Employees */}
          <div 
            onClick={() => openDrillDown('Total Employee Headcount', '15,420 Active Records', 'Global workforce roster', [
              { label: 'Full-time Permanent', value: 13850 },
              { label: 'Contractors & Consultants', value: 1570 },
            ])}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl hover:border-slate-700 transition-all cursor-pointer group space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Eye size={22} />
              </div>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-400">
                0.43% <ArrowUpRight size={14} />
              </span>
            </div>
            <div>
              <h4 className="text-2xl lg:text-3xl font-black text-white tracking-tight">$3.456K</h4>
              <p className="text-xs font-semibold text-slate-400 mt-1">Total Workforce Views</p>
            </div>
          </div>

          {/* Card 2: Total Profit / Attendance Rate */}
          <div 
            onClick={() => openDrillDown('Attendance Compliance Rate', '96.5%', 'Weekly shift adherence', [
              { label: 'On-Time Clock Ins', value: '94.2%' },
              { label: 'Approved Remote WFH', value: '2.3%' },
            ])}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl hover:border-slate-700 transition-all cursor-pointer group space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingCart size={22} />
              </div>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-400">
                4.35% <ArrowUpRight size={14} />
              </span>
            </div>
            <div>
              <h4 className="text-2xl lg:text-3xl font-black text-white tracking-tight">$45,2K</h4>
              <p className="text-xs font-semibold text-slate-400 mt-1">Total Attendance Revenue</p>
            </div>
          </div>

          {/* Card 3: Total Product / Productivity Index */}
          <div 
            onClick={() => openDrillDown('Performance Score Index', '87% Average', 'Quarterly KPI score', [
              { label: 'Exceeding Expectations', value: '58%' },
              { label: 'Meeting Targets', value: '38%' },
            ])}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl hover:border-slate-700 transition-all cursor-pointer group space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingBag size={22} />
              </div>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-400">
                2.59% <ArrowUpRight size={14} />
              </span>
            </div>
            <div>
              <h4 className="text-2xl lg:text-3xl font-black text-white tracking-tight">2.450</h4>
              <p className="text-xs font-semibold text-slate-400 mt-1">Total Productivity Tasks</p>
            </div>
          </div>

          {/* Card 4: Total Users / Headcount */}
          <div 
            onClick={() => openDrillDown('Active Job Requisitions', '124 Roles', 'Hiring pipeline', [
              { label: 'Engineering Roles', value: 64 },
              { label: 'Sales & Growth', value: 32 },
            ])}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl hover:border-slate-700 transition-all cursor-pointer group space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users size={22} />
              </div>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-sky-400">
                0.95% <ArrowDownRight size={14} />
              </span>
            </div>
            <div>
              <h4 className="text-2xl lg:text-3xl font-black text-white tracking-tight">3.456</h4>
              <p className="text-xs font-semibold text-slate-400 mt-1">Total Active Users</p>
            </div>
          </div>

        </div>

        {/* TAILADMIN MIDDLE MAIN CHART GRID: 8 COLUMNS (LEFT AREA CHART) + 4 COLUMNS (RIGHT BAR CHART) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT 8 COLUMNS: Total Revenue & Workforce Growth Area Chart */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Total Revenue
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Total Sales
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-400 mt-1">12.04.2026 - 12.05.2026</p>
              </div>

              {/* Day / Week / Month Toggle Pills */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                {(['Day', 'Week', 'Month'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setTimeRange(mode)}
                    className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all ${
                      timeRange === mode
                        ? 'bg-slate-800 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <WorkforceGrowthLine />
          </div>

          {/* RIGHT 4 COLUMNS: Profit This Week / Department Productivity Stacked Bar Chart */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-white">Profit this week</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-blue-400">
                    <span className="w-2 h-2 rounded-full bg-blue-600" /> Sales
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-cyan-400">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" /> Revenue
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                This Week ∨
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center min-h-[260px]">
              <AttendanceOverviewBar />
            </div>
          </div>

        </div>

        {/* TAILADMIN BOTTOM GRID: Department Distribution & Performance Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left 6 Columns: Department Distribution */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
            <DepartmentDistribution />
          </div>

          {/* Right 6 Columns: Employee Engagement & Performance Radar */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
            <EmployeeEngagementRadar />
          </div>

        </div>

        {/* Recent Enterprise Activity Stream & Celebrations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Activity size={18} className="text-blue-500" /> Recent Enterprise Activity
              </h3>
              <Link to="/audit-logs" className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1">
                Audit Stream <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { title: 'New employee joined Engineering team', time: '10m ago', user: 'Alex Mercer', badge: 'Onboarding', color: 'text-emerald-400 bg-emerald-500/10' },
                { title: 'Attendance marked for 14,850 employees', time: '1h ago', user: 'System Automated', badge: 'Attendance', color: 'text-blue-400 bg-blue-500/10' },
                { title: 'Leave request approved for Sarah Connor', time: '2h ago', user: 'Elena Rostova (HR)', badge: 'Approval', color: 'text-purple-400 bg-purple-500/10' },
                { title: 'Quarterly Performance KPI scores updated', time: '3h ago', user: 'David Sterling', badge: 'Performance', color: 'text-amber-400 bg-amber-500/10' },
              ].map((act, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white">{act.title}</p>
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

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Calendar size={18} className="text-purple-400" /> Upcoming Celebrations
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-3">
                <Gift size={20} className="text-purple-400 shrink-0" />
                <div>
                  <p className="font-bold text-white">Sarah Connor's Birthday</p>
                  <p className="text-[10px] text-slate-400">Tomorrow • Product Team</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
                <PartyPopper size={20} className="text-amber-400 shrink-0" />
                <div>
                  <p className="font-bold text-white">David Sterling's 5th Work Anniversary</p>
                  <p className="text-[10px] text-slate-400">Friday • Engineering Dept</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Drill Down Modal */}
        <DrillDownModal isOpen={!!drillDownData} data={drillDownData} onClose={() => setDrillDownData(null)} />
      </div>
    </RoleGuard>
  );
};
