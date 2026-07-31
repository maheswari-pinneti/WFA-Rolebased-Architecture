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
  Eye,
  Briefcase
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
  const [collapsed, setCollapsed] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  // Distinct & Non-Overlapping Navigation per Role for 13 Profiles
  const roleNavigationMap: Record<Role, NavigationItem[]> = {
    [Role.SYSTEM_ADMIN]: [
      { label: 'System Dashboard', path: '/system-admin', icon: <LayoutDashboard size={24} strokeWidth={2} className="text-blue-500" /> },
      { label: 'User Directory', path: '/admin/users', icon: <Users size={24} strokeWidth={2} className="text-cyan-400" /> },
      { label: 'Roles & Policies', path: '/admin/roles', icon: <ShieldCheck size={24} strokeWidth={2} className="text-purple-400" /> },
      { label: 'System Settings', path: '/admin/settings', icon: <Sliders size={24} strokeWidth={2} className="text-emerald-400" /> },
      { label: 'Security Audit', path: '/admin/reports', icon: <History size={24} strokeWidth={2} className="text-amber-400" /> },
    ],
    [Role.PLATFORM_ADMIN]: [
      { label: 'Platform Dashboard', path: '/platform-admin', icon: <Layers size={24} strokeWidth={2} className="text-blue-500" /> },
      { label: 'Module Manager', path: '/admin/settings', icon: <Sliders size={24} strokeWidth={2} className="text-cyan-400" /> },
    ],
    [Role.SECURITY_ADMIN]: [
      { label: 'Security Desk', path: '/security-admin', icon: <Lock size={24} strokeWidth={2} className="text-purple-500" /> },
      { label: 'Access Policies', path: '/admin/roles', icon: <ShieldCheck size={24} strokeWidth={2} className="text-purple-400" /> },
      { label: 'Audit Logs', path: '/admin/reports', icon: <History size={24} strokeWidth={2} className="text-amber-400" /> },
    ],
    [Role.ORGANIZATION_ADMIN]: [
      { label: 'Org Dashboard', path: '/org-admin', icon: <Building2 size={24} strokeWidth={2} className="text-indigo-400" /> },
      { label: 'Departments', path: '/admin/users', icon: <Users size={24} strokeWidth={2} className="text-cyan-400" /> },
      { label: 'Headcount Reports', path: '/admin/reports', icon: <BarChart3 size={24} strokeWidth={2} className="text-amber-400" /> },
    ],
    [Role.HR_ADMIN]: [
      { label: 'HR Dashboard', path: '/hr-admin', icon: <LayoutDashboard size={24} strokeWidth={2} className="text-purple-400" /> },
      { label: 'Employee Directory', path: '/hr/employees', icon: <Users size={24} strokeWidth={2} className="text-cyan-400" /> },
      { label: 'Attendance Desk', path: '/hr/attendance', icon: <Clock size={24} strokeWidth={2} className="text-emerald-400" /> },
      { label: 'Performance', path: '/hr/performance', icon: <TrendingUp size={24} strokeWidth={2} className="text-blue-400" /> },
      { label: 'HR Reports', path: '/hr/reports', icon: <BarChart3 size={24} strokeWidth={2} className="text-amber-400" /> },
    ],
    [Role.HR_SPECIALIST]: [
      { label: 'Specialist Desk', path: '/hr-specialist', icon: <Briefcase size={24} strokeWidth={2} className="text-purple-400" /> },
      { label: 'Recruitment & Candidates', path: '/hr/employees', icon: <Users size={24} strokeWidth={2} className="text-cyan-400" /> },
      { label: 'Shift Rotations', path: '/hr/attendance', icon: <Clock size={24} strokeWidth={2} className="text-emerald-400" /> },
    ],
    [Role.DEPARTMENT_HEAD]: [
      { label: 'Dept Dashboard', path: '/dept-head', icon: <Building2 size={24} strokeWidth={2} className="text-indigo-400" /> },
      { label: 'Department Analytics', path: '/manager/analytics', icon: <BarChart3 size={24} strokeWidth={2} className="text-indigo-400" /> },
      { label: 'Headcount Reports', path: '/manager/reports', icon: <BarChart3 size={24} strokeWidth={2} className="text-amber-400" /> },
    ],
    [Role.BUSINESS_MANAGER]: [
      { label: 'Manager Dashboard', path: '/business-manager', icon: <LayoutDashboard size={24} strokeWidth={2} className="text-blue-400" /> },
      { label: 'Team Analytics', path: '/manager/analytics', icon: <BarChart3 size={24} strokeWidth={2} className="text-indigo-400" /> },
      { label: 'Approvals Desk', path: '/manager/approvals', icon: <CheckCircle2 size={24} strokeWidth={2} className="text-emerald-400" /> },
      { label: 'Team Reports', path: '/manager/reports', icon: <BarChart3 size={24} strokeWidth={2} className="text-amber-400" /> },
    ],
    [Role.TEAM_LEAD]: [
      { label: 'Lead Dashboard', path: '/team-lead', icon: <LayoutDashboard size={24} strokeWidth={2} className="text-teal-400" /> },
      { label: 'Team Members', path: '/team-lead/members', icon: <UserCheck size={24} strokeWidth={2} className="text-cyan-400" /> },
      { label: 'Productivity Velocity', path: '/team-lead/productivity', icon: <Zap size={24} strokeWidth={2} className="text-amber-400" /> },
      { label: 'Tasks', path: '/team-lead/tasks', icon: <Flame size={24} strokeWidth={2} className="text-rose-400" /> },
    ],
    [Role.EMPLOYEE]: [
      { label: 'My Dashboard', path: '/employee', icon: <LayoutDashboard size={24} strokeWidth={2} className="text-emerald-400" /> },
      { label: 'My Attendance', path: '/employee/attendance', icon: <Clock size={24} strokeWidth={2} className="text-cyan-400" /> },
      { label: 'My Performance', path: '/employee/performance', icon: <TrendingUp size={24} strokeWidth={2} className="text-blue-400" /> },
      { label: 'My Profile', path: '/employee/profile', icon: <Compass size={24} strokeWidth={2} className="text-purple-400" /> },
      { label: 'Requests', path: '/employee/requests', icon: <FileText size={24} strokeWidth={2} className="text-amber-400" /> },
    ],
    [Role.ANALYST]: [
      { label: 'BI Analytics Dashboard', path: '/analyst', icon: <BarChart3 size={24} strokeWidth={2} className="text-indigo-400" /> },
      { label: 'Report Builder', path: '/manager/reports', icon: <FileSpreadsheet size={24} strokeWidth={2} className="text-emerald-400" /> },
    ],
    [Role.AUDITOR]: [
      { label: 'Audit Dashboard', path: '/auditor', icon: <History size={24} strokeWidth={2} className="text-amber-400" /> },
      { label: 'Compliance Reports', path: '/admin/reports', icon: <BarChart3 size={24} strokeWidth={2} className="text-purple-400" /> },
    ],
    [Role.VIEWER]: [
      { label: 'Executive Read View', path: '/viewer', icon: <Eye size={24} strokeWidth={2} className="text-cyan-400" /> },
      { label: 'Reports View', path: '/employee/performance', icon: <BarChart3 size={24} strokeWidth={2} className="text-blue-400" /> },
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
        {/* Dynamic Left Sidebar */}
        <aside
          className={`bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col shrink-0 fixed md:static inset-y-[102px] left-0 z-30 transition-all duration-200 ${
            collapsed ? 'w-[64px]' : 'w-[220px]'
          } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        >
          <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {currentNav.map((item) => {
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`nav-link ${active ? 'nav-link-active' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Company Help & Support Sidebar Option */}
          <div className="p-3 border-t border-[var(--border-color)] space-y-2">
            <button
              onClick={() => setSupportModalOpen(true)}
              className="nav-link w-full text-left text-blue-500 hover:bg-blue-500/10 transition-colors"
              title={collapsed ? 'Company Help & Support' : undefined}
            >
              <LifeBuoy size={24} strokeWidth={2} className="text-blue-500 shrink-0" />
              {!collapsed && <span className="font-semibold text-sm">Help & Support</span>}
            </button>

            <div className="text-[10px] text-slate-400 text-center font-mono pt-1">
              {!collapsed ? 'Workforce Analytics v3.0' : 'v3.0'}
            </div>
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
