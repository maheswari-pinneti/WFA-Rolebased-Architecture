import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { Role } from '../../security/roles/roles';
import { EnterpriseHeader } from './components/EnterpriseHeader';
import { InformationBar } from './components/InformationBar';
import { SupportModal } from '../components/SupportModal';
import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  Zap,
  Flame,
  UserCheck,
  Compass,
  FileText,
  LifeBuoy,
  Lock,
  Layers,
  FileSpreadsheet,
  History,
  MapPin,
  Briefcase,
  DollarSign,
  Target,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true); // Icon-only by default
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  // Exact Access Modules per Role from 5-Role RBAC Model
  const roleNavigationMap: Record<Role, NavigationItem[]> = {
    [Role.ADMIN]: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={22} strokeWidth={2} className="text-blue-400" /> },
      { label: 'User Management', path: '/admin/users', icon: <Users size={22} strokeWidth={2} className="text-cyan-400" /> },
      { label: 'Role Management', path: '/admin/roles', icon: <ShieldCheck size={22} strokeWidth={2} className="text-purple-400" /> },
      { label: 'Permissions', path: '/admin/permissions', icon: <Lock size={22} strokeWidth={2} className="text-indigo-400" /> },
      { label: 'Employee Control', path: '/admin/employees', icon: <UserCheck size={22} strokeWidth={2} className="text-emerald-400" /> },
      { label: 'Departments', path: '/admin/departments', icon: <Building2 size={22} strokeWidth={2} className="text-purple-400" /> },
      { label: 'Locations', path: '/admin/locations', icon: <MapPin size={22} strokeWidth={2} className="text-amber-400" /> },
      { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={22} strokeWidth={2} className="text-cyan-400" /> },
      { label: 'Reports', path: '/admin/reports', icon: <FileSpreadsheet size={22} strokeWidth={2} className="text-blue-400" /> },
      { label: 'Audit Logs', path: '/admin/audit-logs', icon: <History size={22} strokeWidth={2} className="text-amber-400" /> },
      { label: 'System Settings', path: '/admin/settings', icon: <Sliders size={22} strokeWidth={2} className="text-slate-400" /> },
      { label: 'Configuration', path: '/admin/configuration', icon: <Layers size={22} strokeWidth={2} className="text-teal-400" /> },
    ],
    [Role.HR]: [
      { label: 'HR Dashboard', path: '/hr/dashboard', icon: <LayoutDashboard size={22} strokeWidth={2} className="text-purple-400" /> },
      { label: 'Employee Management', path: '/hr/employees', icon: <Users size={22} strokeWidth={2} className="text-cyan-400" /> },
      { label: 'Recruitment', path: '/hr/recruitment', icon: <Briefcase size={22} strokeWidth={2} className="text-amber-400" /> },
      { label: 'Attendance', path: '/hr/attendance', icon: <Clock size={22} strokeWidth={2} className="text-emerald-400" /> },
      { label: 'Leave Management', path: '/hr/leave', icon: <FileText size={22} strokeWidth={2} className="text-blue-400" /> },
      { label: 'Performance', path: '/hr/performance', icon: <TrendingUp size={22} strokeWidth={2} className="text-purple-400" /> },
      { label: 'Payroll Reports', path: '/hr/payroll-reports', icon: <DollarSign size={22} strokeWidth={2} className="text-emerald-400" /> },
      { label: 'Workforce Analytics', path: '/hr/workforce-analytics', icon: <BarChart3 size={22} strokeWidth={2} className="text-indigo-400" /> },
      { label: 'HR Reports', path: '/hr/reports', icon: <FileSpreadsheet size={22} strokeWidth={2} className="text-amber-400" /> },
    ],
    [Role.MANAGER]: [
      { label: 'Manager Dashboard', path: '/manager/dashboard', icon: <LayoutDashboard size={22} strokeWidth={2} className="text-blue-400" /> },
      { label: 'Team Overview', path: '/manager/team', icon: <Users size={22} strokeWidth={2} className="text-cyan-400" /> },
      { label: 'Team Analytics', path: '/manager/analytics', icon: <BarChart3 size={22} strokeWidth={2} className="text-indigo-400" /> },
      { label: 'Attendance', path: '/manager/attendance', icon: <Clock size={22} strokeWidth={2} className="text-emerald-400" /> },
      { label: 'Leave Approval', path: '/manager/approvals', icon: <CheckCircle2 size={22} strokeWidth={2} className="text-teal-400" /> },
      { label: 'Performance Review', path: '/manager/performance', icon: <TrendingUp size={22} strokeWidth={2} className="text-purple-400" /> },
      { label: 'Team Reports', path: '/manager/reports', icon: <FileSpreadsheet size={22} strokeWidth={2} className="text-amber-400" /> },
      { label: 'Productivity', path: '/manager/productivity', icon: <Zap size={22} strokeWidth={2} className="text-amber-400" /> },
    ],
    [Role.TEAM_LEAD]: [
      { label: 'Team Dashboard', path: '/team-lead/dashboard', icon: <LayoutDashboard size={22} strokeWidth={2} className="text-teal-400" /> },
      { label: 'Task Monitoring', path: '/team-lead/tasks', icon: <Flame size={22} strokeWidth={2} className="text-rose-400" /> },
      { label: 'Attendance Tracking', path: '/team-lead/attendance', icon: <Clock size={22} strokeWidth={2} className="text-emerald-400" /> },
      { label: 'Productivity Analytics', path: '/team-lead/productivity', icon: <Zap size={22} strokeWidth={2} className="text-amber-400" /> },
      { label: 'Team Performance', path: '/team-lead/performance', icon: <TrendingUp size={22} strokeWidth={2} className="text-purple-400" /> },
      { label: 'Feedback Management', path: '/team-lead/feedback', icon: <MessageSquare size={22} strokeWidth={2} className="text-blue-400" /> },
    ],
    [Role.EMPLOYEE]: [
      { label: 'My Dashboard', path: '/employee/dashboard', icon: <LayoutDashboard size={22} strokeWidth={2} className="text-emerald-400" /> },
      { label: 'My Profile', path: '/employee/profile', icon: <Compass size={22} strokeWidth={2} className="text-purple-400" /> },
      { label: 'Attendance', path: '/employee/attendance', icon: <Clock size={22} strokeWidth={2} className="text-cyan-400" /> },
      { label: 'Leave Request', path: '/employee/leave', icon: <FileText size={22} strokeWidth={2} className="text-amber-400" /> },
      { label: 'My Performance', path: '/employee/performance', icon: <TrendingUp size={22} strokeWidth={2} className="text-blue-400" /> },
      { label: 'My Goals', path: '/employee/goals', icon: <Target size={22} strokeWidth={2} className="text-rose-400" /> },
      { label: 'Payslip View', path: '/employee/payslips', icon: <DollarSign size={22} strokeWidth={2} className="text-emerald-400" /> },
    ],
  };

  const currentNav = roleNavigationMap[role] || roleNavigationMap[Role.EMPLOYEE];

  return (
    <div data-role={role} className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Fixed Enterprise Header */}
      <EnterpriseHeader onToggleSidebar={() => setCollapsed(!collapsed)} />

      {/* Real-time Status Information Bar */}
      <InformationBar />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sleek Dynamic Sidebar Navigation */}
        <aside
          className={`bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col shrink-0 fixed md:static inset-y-[102px] left-0 z-30 transition-all duration-250 ease-in-out ${
            collapsed ? 'w-[68px]' : 'w-[230px]'
          } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        >
          {/* Top Collapse Toggle Indicator */}
          <div className="p-2 border-b border-[var(--border-color)] flex items-center justify-end">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors mx-auto"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-2.5 space-y-1.5 w-full">
            {currentNav.map((item) => {
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 group relative ${
                    active
                      ? 'bg-blue-600/25 border border-blue-500/50 text-white font-bold shadow-md'
                      : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                >
                  <span className="shrink-0">{item.icon}</span>

                  {!collapsed && (
                    <span className="font-semibold text-xs tracking-tight truncate">{item.label}</span>
                  )}

                  {/* Tooltip on hover when collapsed */}
                  {collapsed && (
                    <span className="absolute left-14 px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-900 text-slate-100 border border-slate-700 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Company Help & Support Sidebar Option */}
          <div className="p-2.5 border-t border-[var(--border-color)] w-full">
            <button
              onClick={() => setSupportModalOpen(true)}
              title="Company Help & Support"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl w-full text-left bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 transition-all group relative ${
                collapsed ? 'justify-center px-0' : ''
              }`}
            >
              <LifeBuoy size={22} strokeWidth={2} className="shrink-0" />
              {!collapsed && <span className="font-bold text-xs">Help & Support</span>}
              {collapsed && (
                <span className="absolute left-14 px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-900 text-slate-100 border border-slate-700 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  Help & Support
                </span>
              )}
            </button>
          </div>
        </aside>

        {/* Main Content Region */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          {children}
        </main>
      </div>

      {/* Support & IT Helpdesk Modal */}
      <SupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      />
    </div>
  );
};
