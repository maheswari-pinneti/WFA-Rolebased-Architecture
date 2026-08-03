import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../auth/hooks/useAuth';
import { Role } from '../../../security/roles/roles';
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
  Target,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  ClipboardList,
  UserCog,
  PieChart,
  LifeBuoy
} from 'lucide-react';

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: {
    text: string;
    variant: 'blue' | 'purple' | 'amber' | 'emerald' | 'rose';
  };
}

interface NavigationCategory {
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
  const [filterQuery, setFilterQuery] = useState('');

  // Human Enterprise Business Navigation Icons
  const roleCategorizedNavMap: Record<Role, NavigationCategory[]> = {
    [Role.ADMIN]: [
      {
        category: 'Main Overview',
        items: [
          { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} strokeWidth={2} className="text-blue-400" /> },
          { label: 'Analytics', path: '/admin/analytics', icon: <PieChart size={20} strokeWidth={2} className="text-cyan-400" /> },
        ],
      },
      {
        category: 'Access & Security',
        items: [
          { label: 'User Management', path: '/admin/users', icon: <UserCog size={20} strokeWidth={2} className="text-cyan-400" />, badge: { text: 'Active', variant: 'blue' } },
          { label: 'Role Management', path: '/admin/roles', icon: <ShieldCheck size={20} strokeWidth={2} className="text-purple-400" /> },
          { label: 'Permissions', path: '/admin/permissions', icon: <Lock size={20} strokeWidth={2} className="text-indigo-400" /> },
          { label: 'Employee Control', path: '/admin/employees', icon: <UserCheck size={20} strokeWidth={2} className="text-emerald-400" /> },
        ],
      },
      {
        category: 'Organization Infrastructure',
        items: [
          { label: 'Departments', path: '/admin/departments', icon: <Building2 size={20} strokeWidth={2} className="text-purple-400" /> },
          { label: 'Locations', path: '/admin/locations', icon: <MapPin size={20} strokeWidth={2} className="text-amber-400" /> },
        ],
      },
      {
        category: 'System Governance',
        items: [
          { label: 'Reports', path: '/admin/reports', icon: <FileSpreadsheet size={20} strokeWidth={2} className="text-blue-400" /> },
          { label: 'Audit Logs', path: '/admin/audit-logs', icon: <History size={20} strokeWidth={2} className="text-rose-400" />, badge: { text: 'Live', variant: 'emerald' } },
          { label: 'System Settings', path: '/admin/settings', icon: <Sliders size={20} strokeWidth={2} className="text-slate-400" /> },
          { label: 'Configuration', path: '/admin/configuration', icon: <Layers size={20} strokeWidth={2} className="text-teal-400" /> },
        ],
      },
    ],

    [Role.HR]: [
      {
        category: 'Core HR Ops',
        items: [
          { label: 'HR Dashboard', path: '/hr/dashboard', icon: <LayoutDashboard size={20} strokeWidth={2} className="text-purple-400" /> },
          { label: 'Employee Management', path: '/hr/employees', icon: <Users size={20} strokeWidth={2} className="text-cyan-400" /> },
          { label: 'Recruitment', path: '/hr/recruitment', icon: <Briefcase size={20} strokeWidth={2} className="text-amber-400" />, badge: { text: 'Hiring', variant: 'purple' } },
        ],
      },
      {
        category: 'Workforce Operations',
        items: [
          { label: 'Attendance', path: '/hr/attendance', icon: <Clock size={20} strokeWidth={2} className="text-emerald-400" /> },
          { label: 'Leave Management', path: '/hr/leave', icon: <FileText size={20} strokeWidth={2} className="text-blue-400" />, badge: { text: '5 New', variant: 'rose' } },
          { label: 'Performance', path: '/hr/performance', icon: <TrendingUp size={20} strokeWidth={2} className="text-purple-400" /> },
        ],
      },
      {
        category: 'Finance & Ledger',
        items: [
          { label: 'Payroll Reports', path: '/hr/payroll-reports', icon: <DollarSign size={20} strokeWidth={2} className="text-emerald-400" /> },
          { label: 'Workforce Analytics', path: '/hr/workforce-analytics', icon: <BarChart3 size={20} strokeWidth={2} className="text-indigo-400" /> },
          { label: 'HR Reports', path: '/hr/reports', icon: <FileSpreadsheet size={20} strokeWidth={2} className="text-amber-400" /> },
        ],
      },
    ],

    [Role.MANAGER]: [
      {
        category: 'Department Scope Hub',
        items: [
          { label: 'Manager Dashboard', path: '/manager/dashboard', icon: <LayoutDashboard size={20} strokeWidth={2} className="text-blue-400" /> },
          { label: 'Team Overview', path: '/manager/team', icon: <Users size={20} strokeWidth={2} className="text-cyan-400" /> },
          { label: 'Team Analytics', path: '/manager/analytics', icon: <BarChart3 size={20} strokeWidth={2} className="text-indigo-400" /> },
        ],
      },
      {
        category: 'Operations & Approvals',
        items: [
          { label: 'Attendance', path: '/manager/attendance', icon: <Clock size={20} strokeWidth={2} className="text-emerald-400" /> },
          { label: 'Leave Approval', path: '/manager/approvals', icon: <CheckCircle2 size={20} strokeWidth={2} className="text-teal-400" />, badge: { text: '3 Review', variant: 'amber' } },
          { label: 'Performance Review', path: '/manager/performance', icon: <TrendingUp size={20} strokeWidth={2} className="text-purple-400" /> },
        ],
      },
      {
        category: 'Reports & Velocity',
        items: [
          { label: 'Team Reports', path: '/manager/reports', icon: <FileSpreadsheet size={20} strokeWidth={2} className="text-amber-400" /> },
          { label: 'Productivity', path: '/manager/productivity', icon: <Zap size={20} strokeWidth={2} className="text-amber-400" /> },
        ],
      },
    ],

    [Role.TEAM_LEAD]: [
      {
        category: 'Lead Operations',
        items: [
          { label: 'Team Dashboard', path: '/team-lead/dashboard', icon: <LayoutDashboard size={20} strokeWidth={2} className="text-teal-400" /> },
          { label: 'Task Monitoring', path: '/team-lead/tasks', icon: <ClipboardList size={20} strokeWidth={2} className="text-rose-400" />, badge: { text: '8 Active', variant: 'rose' } },
        ],
      },
      {
        category: 'Sprint Tracking',
        items: [
          { label: 'Attendance Tracking', path: '/team-lead/attendance', icon: <Clock size={20} strokeWidth={2} className="text-emerald-400" /> },
          { label: 'Productivity Analytics', path: '/team-lead/productivity', icon: <BarChart3 size={20} strokeWidth={2} className="text-amber-400" /> },
          { label: 'Team Performance', path: '/team-lead/performance', icon: <TrendingUp size={20} strokeWidth={2} className="text-purple-400" /> },
          { label: 'Feedback Management', path: '/team-lead/feedback', icon: <MessageSquare size={20} strokeWidth={2} className="text-blue-400" /> },
        ],
      },
    ],

    [Role.EMPLOYEE]: [
      {
        category: 'Personal Portal',
        items: [
          { label: 'My Dashboard', path: '/employee/dashboard', icon: <LayoutDashboard size={20} strokeWidth={2} className="text-emerald-400" /> },
          { label: 'My Profile', path: '/employee/profile', icon: <User size={20} strokeWidth={2} className="text-purple-400" /> },
        ],
      },
      {
        category: 'Work & Requests',
        items: [
          { label: 'Attendance', path: '/employee/attendance', icon: <Clock size={20} strokeWidth={2} className="text-cyan-400" /> },
          { label: 'Leave Request', path: '/employee/leave', icon: <FileText size={20} strokeWidth={2} className="text-amber-400" /> },
          { label: 'My Performance', path: '/employee/performance', icon: <TrendingUp size={20} strokeWidth={2} className="text-blue-400" /> },
          { label: 'My Goals', path: '/employee/goals', icon: <Target size={20} strokeWidth={2} className="text-rose-400" /> },
          { label: 'Payslip View', path: '/employee/payslips', icon: <DollarSign size={20} strokeWidth={2} className="text-emerald-400" /> },
        ],
      },
    ],
  };

  const currentCategories = roleCategorizedNavMap[role] || roleCategorizedNavMap[Role.EMPLOYEE];

  // Helper function for badge badge colors
  const getBadgeStyle = (variant: 'blue' | 'purple' | 'amber' | 'emerald' | 'rose') => {
    switch (variant) {
      case 'blue':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'purple':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'amber':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'emerald':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'rose':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-25 md:hidden transition-opacity"
        />
      )}

      {/* Sleek Dynamic Sidebar Navigation */}
      <aside
        className={`bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col shrink-0 fixed md:static inset-y-[102px] left-0 z-30 transition-all duration-300 ease-in-out shadow-xl md:shadow-none ${
          collapsed ? 'w-[72px]' : 'w-[250px]'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Sidebar Header & Collapse Toggle */}
        <div className="p-3 border-b border-[var(--border-color)] flex items-center justify-between">
          {!collapsed && (
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase px-2">
              Navigation Menu
            </span>
          )}
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-[var(--bg-tertiary)] transition-all border border-transparent hover:border-[var(--border-color)] mx-auto md:mx-0"
            title={collapsed ? 'Expand Navigation Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Quick Filter Search Input (Visible when Expanded) */}
        {!collapsed && (
          <div className="px-3 pt-3 pb-1">
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-3 text-slate-400 pointer-events-none z-10" />
              <input
                type="text"
                placeholder="Filter links..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] rounded-xl pl-8 pr-7 py-1.5 focus:outline-none focus:border-blue-500 transition-colors"
              />
              {filterQuery && (
                <button
                  onClick={() => setFilterQuery('')}
                  className="absolute right-2 text-slate-400 hover:text-slate-200 p-0.5 rounded"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Scrollable Navigation List */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 w-full custom-scrollbar">
          {currentCategories.map((cat, groupIdx) => {
            // Filter category items if user typed a search query
            const filteredItems = cat.items.filter((item) =>
              item.label.toLowerCase().includes(filterQuery.toLowerCase())
            );

            if (filterQuery && filteredItems.length === 0) return null;

            return (
              <div key={groupIdx} className="space-y-1">
                {/* Category Header Label (when expanded) */}
                {!collapsed && (
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400/80">
                    {cat.category}
                  </div>
                )}

                {/* Navigation Links */}
                {filteredItems.map((item) => {
                  const active = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group relative no-underline hover:no-underline text-inherit ${
                        active
                          ? 'bg-blue-600/15 border border-blue-500/50 text-blue-500 font-bold shadow-md shadow-blue-500/10'
                          : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-transparent hover:border-[var(--border-color)]'
                      } ${collapsed ? 'justify-center px-0' : ''}`}
                    >
                      {/* Active Indicator Bar on Left */}
                      {active && !collapsed && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-blue-500 shadow-sm shadow-blue-400" />
                      )}

                      <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                        {item.icon}
                      </span>

                      {!collapsed && (
                        <span className="font-semibold text-xs tracking-tight truncate flex-1 min-w-0">
                          {item.label}
                        </span>
                      )}

                      {/* Badge if present */}
                      {!collapsed && item.badge && (
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md border ml-auto shrink-0 ${getBadgeStyle(
                            item.badge.variant
                          )}`}
                        >
                          {item.badge.text}
                        </span>
                      )}

                      {/* Collapsed Hover Tooltip */}
                      {collapsed && (
                        <span className="absolute left-16 px-3 py-1.5 text-xs font-bold rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-50 whitespace-nowrap flex items-center gap-2">
                          {item.label}
                          {item.badge && (
                            <span
                              className={`px-1.5 py-0.2 text-[9px] font-bold rounded ${getBadgeStyle(
                                item.badge.variant
                              )}`}
                            >
                              {item.badge.text}
                            </span>
                          )}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Company Help & Support Option at Bottom */}
        <div className="p-2.5 border-t border-[var(--border-color)] w-full">
          <button
            onClick={onOpenSupport}
            title="Company Help & Support"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left bg-gradient-to-r from-blue-600/10 to-indigo-600/10 hover:from-blue-600/20 hover:to-indigo-600/20 border border-blue-500/30 text-blue-400 transition-all group relative ${
              collapsed ? 'justify-center px-0' : ''
            }`}
          >
            <LifeBuoy size={20} strokeWidth={2} className="shrink-0 transition-transform group-hover:rotate-45 duration-300" />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">Help & Support</div>
                <div className="text-[10px] text-slate-400 truncate">24/7 Enterprise IT Desk</div>
              </div>
            )}
            {collapsed && (
              <span className="absolute left-16 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-900 text-slate-100 border border-slate-700 shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 whitespace-nowrap">
                Help & Support
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
