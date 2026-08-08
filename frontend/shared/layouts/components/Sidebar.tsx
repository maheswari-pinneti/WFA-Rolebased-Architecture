import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useTheme } from '../../../design-system/theme/theme';
import { Role } from '../../../security/roles/roles';
import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  TrendingUp,
  BarChart3,
  Sliders,
  CheckCircle2,
  Zap,
  User,
  FileText,
  Layers,
  FileSpreadsheet,
  History,
  Briefcase,
  DollarSign,
  ClipboardList,
  UserCog,
  PieChart,
  Network,
  Globe,
  Calendar,
  Timer,
  CheckSquare,
  ShieldAlert,
  Compass,
  Target,
  Map,
  Activity,
  Key,
  ShieldCheck,
  MapPin,
  HelpCircle,
  Award,
  AlertTriangle,
  Star
} from 'lucide-react';

export interface NavigationItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: {
    text: string;
    variant: 'blue' | 'purple' | 'amber' | 'emerald' | 'rose';
  };
}

export interface NavigationCategory {
  category: string;
  items: NavigationItem[];
}

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onOpenSupport: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  onOpenSupport,
}) => {
  const { role } = useAuth();
  const location = useLocation();

  // Clean Navigation Structure
  const roleCategorizedNavMap: Record<Role, NavigationCategory[]> = {
    [Role.ADMIN]: [
      {
        category: 'Dashboard',
        items: [
          { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} strokeWidth={2} className="text-blue-400" /> },
        ],
      },
      {
        category: 'Analytics',
        items: [
          { label: 'Workforce Analytics', path: '/admin/analytics', icon: <BarChart3 size={18} strokeWidth={2} className="text-indigo-400" /> },
          { label: 'Attendance Analytics', path: '/hr/attendance', icon: <Clock size={18} strokeWidth={2} className="text-emerald-400" /> },
          { label: 'Hiring Analytics', path: '/hr/recruitment', icon: <Briefcase size={18} strokeWidth={2} className="text-amber-400" /> },
          { label: 'Performance Analytics', path: '/hr/performance', icon: <TrendingUp size={18} strokeWidth={2} className="text-purple-400" /> },
          { label: 'Productivity Analytics', path: '/admin/productivity', icon: <Zap size={18} strokeWidth={2} className="text-blue-400" /> },
          { label: 'Skills Analytics', path: '/admin/skills-gaps', icon: <Award size={18} strokeWidth={2} className="text-yellow-400" /> },
          { label: 'Risk Analytics', path: '/admin/risk', icon: <AlertTriangle size={18} strokeWidth={2} className="text-rose-400" /> },
        ],
      },
      {
        category: 'Workforce',
        items: [
          { label: 'Employees', path: '/admin/employees', icon: <Users size={18} strokeWidth={2} className="text-cyan-400" /> },
          { label: 'Departments', path: '/admin/departments', icon: <Building2 size={18} strokeWidth={2} className="text-purple-400" /> },
          { label: 'Teams', path: '/admin/teams', icon: <Network size={18} strokeWidth={2} className="text-teal-400" /> },
          { label: 'Organization', path: '/admin/organization', icon: <Globe size={18} strokeWidth={2} className="text-sky-400" /> },
        ],
      },
      {
        category: 'Attendance',
        items: [
          { label: 'Overview', path: '/admin/attendance-overview', icon: <Calendar size={18} strokeWidth={2} className="text-blue-400" /> },
          { label: 'Attendance History', path: '/admin/attendance-history', icon: <History size={18} strokeWidth={2} className="text-rose-400" /> },
          { label: 'Shifts', path: '/admin/shifts', icon: <Timer size={18} strokeWidth={2} className="text-emerald-400" /> },
          { label: 'Corrections', path: '/admin/corrections', icon: <CheckSquare size={18} strokeWidth={2} className="text-amber-400" /> },
          { label: 'Approvals', path: '/admin/approvals', icon: <ShieldAlert size={18} strokeWidth={2} className="text-red-400" /> },
        ],
      },
      {
        category: 'Skills',
        items: [
          { label: 'Skill Overview', path: '/admin/skills-overview', icon: <Compass size={18} strokeWidth={2} className="text-cyan-400" /> },
          { label: 'Skill Gaps', path: '/admin/skills-gaps', icon: <Target size={18} strokeWidth={2} className="text-rose-400" /> },
          { label: 'Skill Coverage', path: '/admin/skills-coverage', icon: <Map size={18} strokeWidth={2} className="text-indigo-400" /> },
        ],
      },
      {
        category: 'Performance',
        items: [
          { label: 'Performance Overview', path: '/admin/performance-overview', icon: <Star size={18} strokeWidth={2} className="text-amber-400" /> },
          { label: 'Productivity', path: '/admin/productivity-metrics', icon: <Activity size={18} strokeWidth={2} className="text-emerald-400" /> },
        ],
      },
      {
        category: 'Administration',
        items: [
          { label: 'Users & Roles', path: '/admin/users', icon: <UserCog size={18} strokeWidth={2} className="text-cyan-400" /> },
          { label: 'Permissions', path: '/admin/permissions', icon: <Key size={18} strokeWidth={2} className="text-yellow-400" /> },
          { label: 'Access Control', path: '/admin/access-control', icon: <ShieldCheck size={18} strokeWidth={2} className="text-green-400" /> },
          { label: 'Geofencing', path: '/admin/geofencing', icon: <MapPin size={18} strokeWidth={2} className="text-orange-400" /> },
          { label: 'Audit Logs', path: '/admin/audit-logs', icon: <FileSpreadsheet size={18} strokeWidth={2} className="text-rose-400" /> },
        ],
      },
      {
        category: 'Settings',
        items: [
          { label: 'Settings', path: '/admin/settings', icon: <Sliders size={18} strokeWidth={2} className="text-slate-400" /> },
        ],
      },
      {
        category: 'Help & Support',
        items: [
          { label: 'Help & Support', path: '#support', icon: <HelpCircle size={18} strokeWidth={2} className="text-slate-400" /> },
        ],
      },
    ],

    [Role.HR]: [
      {
        category: 'General',
        items: [
          { label: 'HR Dashboard', path: '/hr/dashboard', icon: <LayoutDashboard size={18} strokeWidth={2} className="text-purple-400" /> },
          { label: 'Employee Directory', path: '/hr/employees', icon: <Users size={18} strokeWidth={2} className="text-cyan-400" /> },
          { label: 'Recruitment', path: '/hr/recruitment', icon: <Briefcase size={18} strokeWidth={2} className="text-amber-400" />, badge: { text: 'Hiring', variant: 'purple' } },
        ],
      },
      {
        category: 'Analytics',
        items: [
          { label: 'Workforce Analytics', path: '/hr/workforce-analytics', icon: <BarChart3 size={18} strokeWidth={2} className="text-indigo-400" /> },
        ],
      },
      {
        category: 'Settings',
        items: [
          { label: 'Leave Requests', path: '/hr/leave', icon: <FileText size={18} strokeWidth={2} className="text-blue-400" />, badge: { text: '5 New', variant: 'rose' } },
          { label: 'Payroll Ledger', path: '/hr/payroll-reports', icon: <DollarSign size={18} strokeWidth={2} className="text-emerald-400" /> },
        ],
      },
    ],

    [Role.MANAGER]: [
      {
        category: 'General',
        items: [
          { label: 'Manager Dashboard', path: '/manager/dashboard', icon: <LayoutDashboard size={18} strokeWidth={2} className="text-blue-400" /> },
          { label: 'Team Directory', path: '/manager/team', icon: <Users size={18} strokeWidth={2} className="text-cyan-400" /> },
        ],
      },
      {
        category: 'Analytics',
        items: [
          { label: 'Team Analytics', path: '/manager/analytics', icon: <BarChart3 size={18} strokeWidth={2} className="text-indigo-400" /> },
          { label: 'Productivity Metrics', path: '/manager/productivity', icon: <Zap size={18} strokeWidth={2} className="text-amber-400" /> },
          { label: 'Performance Reviews', path: '/manager/performance', icon: <TrendingUp size={18} strokeWidth={2} className="text-purple-400" /> },
          { label: 'Team Reports', path: '/manager/reports', icon: <FileSpreadsheet size={18} strokeWidth={2} className="text-amber-400" /> },
        ],
      },
      {
        category: 'Settings',
        items: [
          { label: 'Attendance Roster', path: '/manager/attendance', icon: <Clock size={18} strokeWidth={2} className="text-emerald-400" /> },
          { label: 'Leave Approvals', path: '/manager/approvals', icon: <CheckCircle2 size={18} strokeWidth={2} className="text-teal-400" />, badge: { text: '3 Review', variant: 'amber' } },
        ],
      },
    ],

    [Role.TEAM_LEAD]: [
      {
        category: 'General',
        items: [
          { label: 'Team Lead Dashboard', path: '/team-lead/dashboard', icon: <LayoutDashboard size={18} strokeWidth={2} className="text-teal-400" /> },
          { label: 'Task Monitoring', path: '/team-lead/tasks', icon: <ClipboardList size={18} strokeWidth={2} className="text-rose-400" />, badge: { text: '8 Active', variant: 'rose' } },
        ],
      },
      {
        category: 'Analytics',
        items: [
          { label: 'Productivity Analytics', path: '/team-lead/productivity', icon: <BarChart3 size={18} strokeWidth={2} className="text-amber-400" /> },
          { label: 'Team Performance', path: '/team-lead/performance', icon: <TrendingUp size={18} strokeWidth={2} className="text-purple-400" /> },
        ],
      },
      {
        category: 'Settings',
        items: [
          { label: 'Attendance Tracking', path: '/team-lead/attendance', icon: <Clock size={18} strokeWidth={2} className="text-emerald-400" /> },
        ],
      },
    ],

    [Role.EMPLOYEE]: [
      {
        category: 'General',
        items: [
          { label: 'My Dashboard', path: '/employee/dashboard', icon: <LayoutDashboard size={18} strokeWidth={2} className="text-blue-400" /> },
          { label: 'My Profile', path: '/employee/profile', icon: <User size={18} strokeWidth={2} className="text-emerald-400" /> },
        ],
      },
      {
        category: 'Analytics',
        items: [
          { label: 'My Performance', path: '/employee/performance', icon: <TrendingUp size={18} strokeWidth={2} className="text-purple-400" /> },
          { label: 'My Goals', path: '/employee/goals', icon: <FileText size={18} strokeWidth={2} className="text-cyan-400" /> },
        ],
      },
      {
        category: 'Settings',
        items: [
          { label: 'My Attendance', path: '/employee/attendance', icon: <Clock size={18} strokeWidth={2} className="text-amber-400" /> },
          { label: 'My Payslips', path: '/employee/payslips', icon: <DollarSign size={18} strokeWidth={2} className="text-emerald-400" /> },
        ],
      },
    ],
  };

  const { theme } = useTheme();
  const currentCategories = roleCategorizedNavMap[role as Role] || roleCategorizedNavMap[Role.EMPLOYEE];
  const isDark = theme === 'dark';

  const getBadgeStyle = (variant: 'blue' | 'purple' | 'amber' | 'emerald' | 'rose') => {
    switch (variant) {
      case 'blue':
        return isDark ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-50 text-blue-600 border-blue-200';
      case 'purple':
        return isDark ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-50 text-purple-600 border-purple-200';
      case 'amber':
        return isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-600 border-amber-200';
      case 'emerald':
        return isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'rose':
        return isDark ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-rose-50 text-rose-600 border-rose-200';
      default:
        return isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <>
      {/* Mobile Off-Canvas Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          aria-label="Close Off-Canvas Drawer"
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 md:hidden transition-opacity"
        />
      )}

      {/* Modern Clean Enterprise SaaS Left Sidebar */}
      <aside
        className={`app-sidebar ${
          isDark ? 'bg-[#0B1120] text-slate-100 border-slate-800 shadow-2xl' : 'bg-white text-slate-800 border-slate-200 shadow-md'
        } border-r flex flex-col shrink-0 fixed md:sticky top-[72px] h-[calc(100vh-72px)] left-0 z-30 transition-all duration-300 ease-in-out font-sans ${
          collapsed ? 'w-[64px]' : 'w-[220px]'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Sidebar Navigation Items List */}
        <nav className="sidebar-nav flex-1 overflow-y-auto px-3 py-1 space-y-1 w-full scrollbar-thin">
          {currentCategories.map((cat: NavigationCategory, groupIdx: number) => {
            return (
              <React.Fragment key={groupIdx}>
                {/* Subtle Divider Line Between Logical Groups */}
                {groupIdx > 0 && !collapsed && (
                  <div className={`my-2 border-t ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`} />
                )}

                {/* Section Header Title */}
                {!collapsed && cat.category && cat.category !== 'General' && cat.category !== 'Dashboard' && cat.category !== 'Settings' && cat.category !== 'Help & Support' && (
                  <div className={`px-3.5 pt-3 pb-1.5 text-[10px] font-black tracking-wider uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {cat.category}
                  </div>
                )}

                {/* Clean Navigation Links */}
                {cat.items.map((item: NavigationItem) => {
                  const active = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      title={collapsed ? item.label : undefined}
                      className={`sidebar-nav-link flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-200 group relative no-underline text-inherit ${
                        active
                          ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-extrabold shadow-lg shadow-blue-500/25 border border-blue-500/40'
                          : isDark
                            ? 'hover:bg-slate-800/60 text-slate-300 hover:text-white border border-transparent hover:border-slate-800/60'
                            : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent hover:border-slate-200'
                      } ${collapsed ? 'justify-center px-0' : ''}`}
                    >
                      <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                        {item.icon}
                      </span>

                      {!collapsed && (
                        <span className="font-bold text-xs tracking-tight truncate flex-1 min-w-0">
                          {item.label}
                        </span>
                      )}

                      {/* Unread Badge Counter */}
                      {!collapsed && item.badge && (
                        <span
                          className={`sidebar-badge px-1.5 py-0.5 text-[10px] font-extrabold rounded-md border ml-auto shrink-0 ${getBadgeStyle(
                            item.badge.variant
                          )}`}
                        >
                          {item.badge.text}
                        </span>
                      )}

                      {/* Collapsed Hover Tooltip */}
                      {collapsed && (
                        <span className={`absolute left-16 px-3 py-1.5 text-xs font-bold rounded-xl border shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-50 whitespace-nowrap flex items-center gap-2 ${
                          isDark ? 'bg-slate-900 text-slate-100 border-slate-700' : 'bg-white text-slate-800 border-slate-200'
                        }`}>
                          {item.label}
                          {item.badge && (
                            <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${getBadgeStyle(item.badge.variant)}`}>
                              {item.badge.text}
                            </span>
                          )}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </React.Fragment>
            );
          })}
        </nav>

      </aside>
    </>
  );
};
