import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../auth/hooks/useAuth';
import { Role } from '../../../security/roles/roles';
import { UserProfile } from '../../../components/sidebar/UserProfile';
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
  UserCheck,
  User,
  FileText,
  Lock,
  Layers,
  FileSpreadsheet,
  History,
  MapPin,
  Briefcase,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  ClipboardList,
  UserCog,
  PieChart
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
  category: 'General' | 'Analytics' | 'Settings';
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
}) => {
  const { role } = useAuth();
  const location = useLocation();
  const [filterQuery, setFilterQuery] = useState('');

  // Clean Navigation Structure
  const roleCategorizedNavMap: Record<Role, NavigationCategory[]> = {
    [Role.ADMIN]: [
      {
        category: 'General',
        items: [
          { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} strokeWidth={2} className="text-blue-400" /> },
          { label: 'Employee Directory', path: '/admin/employees', icon: <Users size={18} strokeWidth={2} className="text-cyan-400" /> },
          { label: 'Departments', path: '/admin/departments', icon: <Building2 size={18} strokeWidth={2} className="text-purple-400" /> },
          { label: 'Office Locations', path: '/admin/locations', icon: <MapPin size={18} strokeWidth={2} className="text-amber-400" /> },
        ],
      },
      {
        category: 'Analytics',
        items: [
          { label: 'Workforce Analytics', path: '/admin/analytics', icon: <PieChart size={18} strokeWidth={2} className="text-cyan-400" />, badge: { text: 'Live', variant: 'emerald' } },
          { label: 'Attendance Analytics', path: '/hr/attendance', icon: <Clock size={18} strokeWidth={2} className="text-emerald-400" />, badge: { text: '3 Alert', variant: 'rose' } },
          { label: 'Performance Analytics', path: '/hr/performance', icon: <TrendingUp size={18} strokeWidth={2} className="text-purple-400" /> },
          { label: 'Reports & Export', path: '/admin/reports', icon: <FileSpreadsheet size={18} strokeWidth={2} className="text-blue-400" /> },
        ],
      },
      {
        category: 'Settings',
        items: [
          { label: 'User Management', path: '/admin/users', icon: <UserCog size={18} strokeWidth={2} className="text-cyan-400" />, badge: { text: 'Active', variant: 'blue' } },
          { label: 'Audit Logs', path: '/admin/audit-logs', icon: <History size={18} strokeWidth={2} className="text-rose-400" /> },
          { label: 'System Settings', path: '/admin/settings', icon: <Sliders size={18} strokeWidth={2} className="text-slate-400" /> },
          { label: 'Configuration', path: '/admin/configuration', icon: <Layers size={18} strokeWidth={2} className="text-teal-400" /> },
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
          { label: 'Attendance Analytics', path: '/hr/attendance', icon: <Clock size={18} strokeWidth={2} className="text-emerald-400" /> },
          { label: 'Performance Analytics', path: '/hr/performance', icon: <TrendingUp size={18} strokeWidth={2} className="text-purple-400" /> },
          { label: 'Workforce Analytics', path: '/hr/workforce-analytics', icon: <BarChart3 size={18} strokeWidth={2} className="text-indigo-400" /> },
          { label: 'HR Reports', path: '/hr/reports', icon: <FileSpreadsheet size={18} strokeWidth={2} className="text-amber-400" /> },
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

  const currentCategories = roleCategorizedNavMap[role as Role] || roleCategorizedNavMap[Role.EMPLOYEE];

  const getBadgeStyle = (variant: 'blue' | 'purple' | 'amber' | 'emerald' | 'rose') => {
    switch (variant) {
      case 'blue':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'purple':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'amber':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'emerald':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'rose':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
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

      {/* Modern Clean Enterprise SaaS Left Sidebar (Width 260px) */}
      <aside
        className={`bg-[#0B1120] text-slate-100 border-r border-slate-800 flex flex-col shrink-0 fixed md:sticky top-[72px] h-[calc(100vh-72px)] left-0 z-30 transition-all duration-300 ease-in-out shadow-2xl font-sans ${
          collapsed ? 'w-[72px]' : 'w-[260px]'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Sidebar Controls Header */}
        <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
          {!collapsed ? (
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 pl-2">
              Navigation Menu
            </span>
          ) : (
            <span className="w-full text-center text-[10px] font-bold text-slate-400">
              WFA
            </span>
          )}
          <div>
            {/* Mobile Close Button &times; */}
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all border border-slate-700/80"
              title="Close Drawer"
            >
              <X size={16} />
            </button>
            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setCollapsed((prev) => !prev)}
              className="hidden md:block p-1.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-all border border-slate-700/80"
              title={collapsed ? 'Expand Sidebar (260px)' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        </div>

        {/* Quick Search Navigation Input */}
        {!collapsed && (
          <div className="px-3.5 pt-3.5 pb-1">
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-3 text-slate-400 pointer-events-none z-10" />
              <input
                type="text"
                placeholder="Quick search navigation..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-400 rounded-xl pl-8 pr-7 py-2 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
              />
              {filterQuery && (
                <button
                  onClick={() => setFilterQuery('')}
                  className="absolute right-2 text-slate-400 hover:text-white p-0.5 rounded"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Clean Uninterrupted Navigation List (No Harsh Text Headers) */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 w-full scrollbar-thin scrollbar-thumb-slate-800">
          {currentCategories.map((cat: NavigationCategory, groupIdx: number) => {
            const filteredItems = cat.items.filter((item: NavigationItem) =>
              item.label.toLowerCase().includes(filterQuery.toLowerCase())
            );

            if (filterQuery && filteredItems.length === 0) return null;

            return (
              <React.Fragment key={groupIdx}>
                {/* Subtle Divider Line Between Logical Groups */}
                {groupIdx > 0 && !collapsed && (
                  <div className="my-2 border-t border-slate-800/60" />
                )}

                {/* Clean Navigation Links */}
                {filteredItems.map((item: NavigationItem) => {
                  const active = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-200 group relative no-underline text-inherit ${
                        active
                          ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-extrabold shadow-lg shadow-blue-500/25 border border-blue-500/40'
                          : 'hover:bg-slate-800/60 text-slate-300 hover:text-white border border-transparent hover:border-slate-800/60'
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
                          className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded-md border ml-auto shrink-0 ${getBadgeStyle(
                            item.badge.variant
                          )}`}
                        >
                          {item.badge.text}
                        </span>
                      )}

                      {/* Collapsed Hover Tooltip */}
                      {collapsed && (
                        <span className="absolute left-16 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-900 text-slate-100 border border-slate-700 shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-50 whitespace-nowrap flex items-center gap-2">
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

        {/* Bottom User Profile Card */}
        <UserProfile collapsed={collapsed} />
      </aside>
    </>
  );
};
