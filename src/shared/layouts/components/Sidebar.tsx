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
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  ClipboardList,
  UserCog,
  PieChart,
  LifeBuoy,
  Contact,
  HelpCircle
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
          { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} strokeWidth={2} className="text-blue-400" /> },
          { label: 'Analytics', path: '/admin/analytics', icon: <PieChart size={18} strokeWidth={2} className="text-cyan-400" /> },
        ],
      },
      {
        category: 'Access & Security',
        items: [
          { label: 'User Management', path: '/admin/users', icon: <UserCog size={18} strokeWidth={2} className="text-cyan-400" />, badge: { text: 'Active', variant: 'blue' } },
          { label: 'Role Management', path: '/admin/roles', icon: <ShieldCheck size={18} strokeWidth={2} className="text-purple-400" /> },
          { label: 'Permissions', path: '/admin/permissions', icon: <Lock size={18} strokeWidth={2} className="text-indigo-400" /> },
          { label: 'Employee Control', path: '/admin/employees', icon: <UserCheck size={18} strokeWidth={2} className="text-emerald-400" /> },
        ],
      },
      {
        category: 'Organization Infrastructure',
        items: [
          { label: 'Departments', path: '/admin/departments', icon: <Building2 size={18} strokeWidth={2} className="text-purple-400" /> },
          { label: 'Locations', path: '/admin/locations', icon: <MapPin size={18} strokeWidth={2} className="text-amber-400" /> },
        ],
      },
      {
        category: 'System Governance',
        items: [
          { label: 'Reports', path: '/admin/reports', icon: <FileSpreadsheet size={18} strokeWidth={2} className="text-blue-400" /> },
          { label: 'Audit Logs', path: '/admin/audit-logs', icon: <History size={18} strokeWidth={2} className="text-rose-400" />, badge: { text: 'Live', variant: 'emerald' } },
          { label: 'System Settings', path: '/admin/settings', icon: <Sliders size={18} strokeWidth={2} className="text-slate-400" /> },
          { label: 'Configuration', path: '/admin/configuration', icon: <Layers size={18} strokeWidth={2} className="text-teal-400" /> },
        ],
      },
    ],

    [Role.HR]: [
      {
        category: 'Core HR Ops',
        items: [
          { label: 'HR Dashboard', path: '/hr/dashboard', icon: <LayoutDashboard size={18} strokeWidth={2} className="text-purple-400" /> },
          { label: 'Employee Management', path: '/hr/employees', icon: <Users size={18} strokeWidth={2} className="text-cyan-400" /> },
          { label: 'Recruitment', path: '/hr/recruitment', icon: <Briefcase size={18} strokeWidth={2} className="text-amber-400" />, badge: { text: 'Hiring', variant: 'purple' } },
        ],
      },
      {
        category: 'Workforce Operations',
        items: [
          { label: 'Attendance', path: '/hr/attendance', icon: <Clock size={18} strokeWidth={2} className="text-emerald-400" /> },
          { label: 'Leave Management', path: '/hr/leave', icon: <FileText size={18} strokeWidth={2} className="text-blue-400" />, badge: { text: '5 New', variant: 'rose' } },
          { label: 'Performance', path: '/hr/performance', icon: <TrendingUp size={18} strokeWidth={2} className="text-purple-400" /> },
        ],
      },
      {
        category: 'Finance & Ledger',
        items: [
          { label: 'Payroll Reports', path: '/hr/payroll-reports', icon: <DollarSign size={18} strokeWidth={2} className="text-emerald-400" /> },
          { label: 'Workforce Analytics', path: '/hr/workforce-analytics', icon: <BarChart3 size={18} strokeWidth={2} className="text-indigo-400" /> },
          { label: 'HR Reports', path: '/hr/reports', icon: <FileSpreadsheet size={18} strokeWidth={2} className="text-amber-400" /> },
        ],
      },
    ],

    [Role.MANAGER]: [
      {
        category: 'Department Scope Hub',
        items: [
          { label: 'Manager Dashboard', path: '/manager/dashboard', icon: <LayoutDashboard size={18} strokeWidth={2} className="text-blue-400" /> },
          { label: 'Team Overview', path: '/manager/team', icon: <Users size={18} strokeWidth={2} className="text-cyan-400" /> },
          { label: 'Team Analytics', path: '/manager/analytics', icon: <BarChart3 size={18} strokeWidth={2} className="text-indigo-400" /> },
        ],
      },
      {
        category: 'Operations & Approvals',
        items: [
          { label: 'Attendance', path: '/manager/attendance', icon: <Clock size={18} strokeWidth={2} className="text-emerald-400" /> },
          { label: 'Leave Approval', path: '/manager/approvals', icon: <CheckCircle2 size={18} strokeWidth={2} className="text-teal-400" />, badge: { text: '3 Review', variant: 'amber' } },
          { label: 'Performance Review', path: '/manager/performance', icon: <TrendingUp size={18} strokeWidth={2} className="text-purple-400" /> },
        ],
      },
      {
        category: 'Reports & Velocity',
        items: [
          { label: 'Team Reports', path: '/manager/reports', icon: <FileSpreadsheet size={18} strokeWidth={2} className="text-amber-400" /> },
          { label: 'Productivity', path: '/manager/productivity', icon: <Zap size={18} strokeWidth={2} className="text-amber-400" /> },
        ],
      },
    ],

    [Role.TEAM_LEAD]: [
      {
        category: 'Lead Operations',
        items: [
          { label: 'Team Dashboard', path: '/team-lead/dashboard', icon: <LayoutDashboard size={18} strokeWidth={2} className="text-teal-400" /> },
          { label: 'Task Monitoring', path: '/team-lead/tasks', icon: <ClipboardList size={18} strokeWidth={2} className="text-rose-400" />, badge: { text: '8 Active', variant: 'rose' } },
        ],
      },
      {
        category: 'Sprint Tracking',
        items: [
          { label: 'Attendance Tracking', path: '/team-lead/attendance', icon: <Clock size={18} strokeWidth={2} className="text-emerald-400" /> },
          { label: 'Productivity Analytics', path: '/team-lead/productivity', icon: <BarChart3 size={18} strokeWidth={2} className="text-amber-400" /> },
          { label: 'Team Performance', path: '/team-lead/performance', icon: <TrendingUp size={18} strokeWidth={2} className="text-purple-400" /> },
        ],
      },
    ],

    [Role.EMPLOYEE]: [
      {
        category: 'Personal Workspace',
        items: [
          { label: 'My Dashboard', path: '/employee/dashboard', icon: <LayoutDashboard size={18} strokeWidth={2} className="text-blue-400" /> },
          { label: 'My Profile', path: '/employee/profile', icon: <User size={18} strokeWidth={2} className="text-emerald-400" /> },
          { label: 'My Attendance', path: '/employee/attendance', icon: <Clock size={18} strokeWidth={2} className="text-amber-400" /> },
          { label: 'My Performance', path: '/employee/performance', icon: <TrendingUp size={18} strokeWidth={2} className="text-purple-400" /> },
          { label: 'My Goals', path: '/employee/goals', icon: <FileText size={18} strokeWidth={2} className="text-cyan-400" /> },
          { label: 'Payslips', path: '/employee/payslips', icon: <DollarSign size={18} strokeWidth={2} className="text-emerald-400" /> },
        ],
      },
    ],
  };

  const currentCategories = roleCategorizedNavMap[role] || roleCategorizedNavMap[Role.EMPLOYEE];

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
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 md:hidden transition-opacity"
        />
      )}

      {/* Dark Enterprise Sidebar Navigation */}
      <aside
        className={`bg-[#0B1120] text-slate-100 border-r border-slate-800/80 flex flex-col shrink-0 fixed md:sticky top-[102px] h-[calc(100vh-102px)] left-0 z-30 transition-all duration-300 ease-in-out shadow-2xl font-sans ${
          collapsed ? 'w-[80px]' : 'w-[280px]'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Sidebar Header & Collapse Toggle */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
          {!collapsed && (
            <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase px-2">
              Navigation Menu
            </span>
          )}
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-slate-800 mx-auto md:mx-0 shadow-sm"
            title={collapsed ? 'Expand Navigation Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Quick Filter Search Input */}
        {!collapsed && (
          <div className="px-3 pt-3 pb-1">
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-3 text-slate-400 pointer-events-none z-10" />
              <input
                type="text"
                placeholder="Filter links..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 rounded-xl pl-8 pr-7 py-2 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
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

        {/* Scrollable Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4 w-full scrollbar-thin scrollbar-thumb-slate-800">
          {currentCategories.map((cat, groupIdx) => {
            const filteredItems = cat.items.filter((item) =>
              item.label.toLowerCase().includes(filterQuery.toLowerCase())
            );

            if (filterQuery && filteredItems.length === 0) return null;

            return (
              <div key={groupIdx} className="space-y-1">
                {/* Category Header Label */}
                {!collapsed && (
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
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
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-200 group relative no-underline text-inherit ${
                        active
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold shadow-lg shadow-blue-500/25 border border-blue-500/40'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent hover:border-slate-800'
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

                      {/* Collapsed Tooltip */}
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
              </div>
            );
          })}
        </nav>

        {/* Company Help & Support Option at Bottom */}
        <div className="p-3 border-t border-slate-800 w-full">
          <button
            onClick={onOpenSupport}
            title="Company Help & Support"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl w-full text-left bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 transition-all group relative ${
              collapsed ? 'justify-center px-0' : ''
            }`}
          >
            <LifeBuoy size={18} strokeWidth={2} className="shrink-0 transition-transform group-hover:rotate-45 duration-300" />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs text-white">Help & Support</div>
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
