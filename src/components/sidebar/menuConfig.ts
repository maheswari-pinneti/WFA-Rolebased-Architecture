import { Role } from '../../security/roles/roles';
import { Permission } from '../../security/permissions/permissions';
import { MenuGroupConfig } from './types';

export const roleBasedMenuConfigurations: Record<Role, MenuGroupConfig[]> = {
  [Role.ADMIN]: [
    {
      groupTitle: 'Dashboard',
      items: [
        {
          id: 'admin-dash-overview',
          title: 'Overview',
          icon: 'LayoutDashboard',
          path: '/admin/dashboard',
          roles: [Role.ADMIN],
        },
        {
          id: 'admin-dash-insights',
          title: 'Workforce Insights',
          icon: 'Zap',
          path: '/admin/analytics',
          roles: [Role.ADMIN],
          permissions: [Permission.REPORT_VIEW_ALL],
          badge: { text: 'Live', variant: 'emerald' },
        },
      ],
    },
    {
      groupTitle: 'Workforce Management',
      items: [
        {
          id: 'admin-[workforce]-employees',
          title: 'Employees',
          icon: 'Users',
          path: '/admin/employees',
          roles: [Role.ADMIN],
          permissions: [Permission.EMPLOYEE_VIEW_ALL],
        },
        {
          id: 'admin-[workforce]-depts',
          title: 'Departments',
          icon: 'Building2',
          path: '/admin/departments',
          roles: [Role.ADMIN],
        },
        {
          id: 'admin-[workforce]-org-chart',
          title: 'Organization Chart',
          icon: 'Network',
          path: '/admin/departments#chart',
          roles: [Role.ADMIN],
        },
      ],
    },
    {
      groupTitle: 'Attendance Management',
      items: [
        {
          id: 'admin-[att]-dash',
          title: 'Attendance Dashboard',
          icon: 'Clock',
          path: '/hr/attendance',
          roles: [Role.ADMIN],
          permissions: [Permission.ATTENDANCE_VIEW_ALL],
        },
        {
          id: 'admin-[att]-checkin',
          title: 'Check In / Check Out',
          icon: 'UserCheck',
          path: '/hr/attendance#clock',
          roles: [Role.ADMIN],
        },
        {
          id: 'admin-[att]-my',
          title: 'My Attendance',
          icon: 'Calendar',
          path: '/employee/attendance',
          roles: [Role.ADMIN],
        },
        {
          id: 'admin-[att]-team',
          title: 'Team Attendance',
          icon: 'Users',
          path: '/manager/attendance',
          roles: [Role.ADMIN],
        },
        {
          id: 'admin-[att]-reports',
          title: 'Attendance Reports',
          icon: 'FileSpreadsheet',
          path: '/hr/reports#attendance',
          roles: [Role.ADMIN],
        },
        {
          id: 'admin-[att]-shifts',
          title: 'Shift Management',
          icon: 'Layers',
          path: '/hr/attendance#shifts',
          roles: [Role.ADMIN],
        },
      ],
    },
    {
      groupTitle: 'Performance Management',
      items: [
        {
          id: 'admin-[perf]-dash',
          title: 'Performance Dashboard',
          icon: 'TrendingUp',
          path: '/hr/performance',
          roles: [Role.ADMIN],
          permissions: [Permission.PERFORMANCE_MANAGE],
        },
        {
          id: 'admin-[perf]-reviews',
          title: 'Employee Reviews',
          icon: 'Award',
          path: '/hr/performance#reviews',
          roles: [Role.ADMIN],
        },
        {
          id: 'admin-[perf]-kpis',
          title: 'Goals & KPIs',
          icon: 'Target',
          path: '/hr/performance#kpis',
          roles: [Role.ADMIN],
        },
        {
          id: 'admin-[perf]-reports',
          title: 'Performance Reports',
          icon: 'FileText',
          path: '/hr/reports#performance',
          roles: [Role.ADMIN],
        },
      ],
    },
    {
      groupTitle: 'Reports & Analytics',
      items: [
        {
          id: 'admin-[rep]-workforce',
          title: 'Workforce Reports',
          icon: 'BarChart3',
          path: '/hr/reports',
          roles: [Role.ADMIN],
          permissions: [Permission.REPORT_VIEW_ALL],
        },
        {
          id: 'admin-[rep]-attendance',
          title: 'Attendance Reports',
          icon: 'FileSpreadsheet',
          path: '/hr/reports#attendance',
          roles: [Role.ADMIN],
        },
        {
          id: 'admin-[rep]-performance',
          title: 'Performance Reports',
          icon: 'TrendingUp',
          path: '/hr/reports#performance',
          roles: [Role.ADMIN],
        },
        {
          id: 'admin-[rep]-export',
          title: 'Export Center',
          icon: 'Download',
          path: '/hr/reports#export',
          roles: [Role.ADMIN],
        },
      ],
    },
    {
      groupTitle: 'Administration',
      items: [
        {
          id: 'admin-[sys]-users',
          title: 'User Management',
          icon: 'UserCog',
          path: '/admin/users',
          roles: [Role.ADMIN],
          permissions: [Permission.USER_MANAGE],
          badge: { text: 'Active', variant: 'blue' },
        },
        {
          id: 'admin-[sys]-roles',
          title: 'Roles & Permissions',
          icon: 'ShieldCheck',
          path: '/admin/roles',
          roles: [Role.ADMIN],
          permissions: [Permission.ROLE_MANAGE],
        },
        {
          id: 'admin-[sys]-settings',
          title: 'System Settings',
          icon: 'Sliders',
          path: '/admin/settings',
          roles: [Role.ADMIN],
          permissions: [Permission.SYSTEM_CONFIG],
        },
        {
          id: 'admin-[sys]-audit',
          title: 'Audit Logs',
          icon: 'History',
          path: '/admin/audit-logs',
          roles: [Role.ADMIN],
          permissions: [Permission.AUDIT_LOG_VIEW],
          badge: { text: 'Stream', variant: 'emerald' },
        },
      ],
    },
  ],

  [Role.HR]: [
    {
      groupTitle: 'Dashboard',
      items: [
        {
          id: 'hr-overview',
          title: 'Overview',
          icon: 'LayoutDashboard',
          path: '/hr/dashboard',
          roles: [Role.HR],
        },
        {
          id: 'hr-insights',
          title: 'Workforce Insights',
          icon: 'Zap',
          path: '/hr/dashboard#insights',
          roles: [Role.HR],
        },
      ],
    },
    {
      groupTitle: 'Workforce Management',
      items: [
        {
          id: 'hr-employees',
          title: 'Employees',
          icon: 'Users',
          path: '/hr/employees',
          roles: [Role.HR],
          permissions: [Permission.EMPLOYEE_VIEW],
        },
        {
          id: 'hr-departments',
          title: 'Departments',
          icon: 'Building2',
          path: '/admin/departments',
          roles: [Role.HR],
        },
      ],
    },
    {
      groupTitle: 'Attendance Management',
      items: [
        {
          id: 'hr-att-dash',
          title: 'Attendance Dashboard',
          icon: 'Clock',
          path: '/hr/attendance',
          roles: [Role.HR],
          permissions: [Permission.ATTENDANCE_VIEW_ALL],
        },
        {
          id: 'hr-leave',
          title: 'Leave Management',
          icon: 'FileText',
          path: '/hr/leave',
          roles: [Role.HR],
          badge: { text: '5 Pending', variant: 'rose' },
        },
      ],
    },
    {
      groupTitle: 'Performance Management',
      items: [
        {
          id: 'hr-perf-dash',
          title: 'Performance Dashboard',
          icon: 'TrendingUp',
          path: '/hr/performance',
          roles: [Role.HR],
          permissions: [Permission.PERFORMANCE_MANAGE],
        },
        {
          id: 'hr-reviews',
          title: 'Employee Reviews',
          icon: 'Award',
          path: '/hr/performance#reviews',
          roles: [Role.HR],
        },
      ],
    },
    {
      groupTitle: 'Reports & Analytics',
      items: [
        {
          id: 'hr-reports',
          title: 'Workforce Reports',
          icon: 'BarChart3',
          path: '/hr/reports',
          roles: [Role.HR],
          permissions: [Permission.REPORT_VIEW],
        },
        {
          id: 'hr-export',
          title: 'Export Center',
          icon: 'Download',
          path: '/hr/reports#export',
          roles: [Role.HR],
        },
      ],
    },
  ],

  [Role.MANAGER]: [
    {
      groupTitle: 'Dashboard',
      items: [
        {
          id: 'mgr-dash',
          title: 'Overview',
          icon: 'LayoutDashboard',
          path: '/manager/dashboard',
          roles: [Role.MANAGER],
        },
        {
          id: 'mgr-team',
          title: 'My Team',
          icon: 'Users',
          path: '/manager/team',
          roles: [Role.MANAGER],
        },
      ],
    },
    {
      groupTitle: 'Attendance & Approvals',
      items: [
        {
          id: 'mgr-att',
          title: 'Team Attendance',
          icon: 'Clock',
          path: '/manager/attendance',
          roles: [Role.MANAGER],
          permissions: [Permission.ATTENDANCE_VIEW_TEAM],
        },
        {
          id: 'mgr-approvals',
          title: 'Leave Approvals',
          icon: 'CheckCircle2',
          path: '/manager/approvals',
          roles: [Role.MANAGER],
          badge: { text: '3 Review', variant: 'amber' },
        },
      ],
    },
    {
      groupTitle: 'Performance & Reports',
      items: [
        {
          id: 'mgr-perf',
          title: 'Team Performance',
          icon: 'TrendingUp',
          path: '/manager/performance',
          roles: [Role.MANAGER],
          permissions: [Permission.PERFORMANCE_REVIEW],
        },
        {
          id: 'mgr-reports',
          title: 'Department Reports',
          icon: 'BarChart3',
          path: '/manager/analytics',
          roles: [Role.MANAGER],
        },
      ],
    },
  ],

  [Role.TEAM_LEAD]: [
    {
      groupTitle: 'Dashboard',
      items: [
        {
          id: 'tl-dash',
          title: 'Overview',
          icon: 'LayoutDashboard',
          path: '/team-lead/dashboard',
          roles: [Role.TEAM_LEAD],
        },
        {
          id: 'tl-members',
          title: 'Team Members',
          icon: 'Users',
          path: '/team-lead/dashboard#team',
          roles: [Role.TEAM_LEAD],
        },
      ],
    },
    {
      groupTitle: 'Tasks & Operations',
      items: [
        {
          id: 'tl-tasks',
          title: 'Task Status',
          icon: 'ClipboardList',
          path: '/team-lead/tasks',
          roles: [Role.TEAM_LEAD],
          badge: { text: '8 Active', variant: 'rose' },
        },
        {
          id: 'tl-att',
          title: 'Team Attendance',
          icon: 'Clock',
          path: '/team-lead/attendance',
          roles: [Role.TEAM_LEAD],
          permissions: [Permission.ATTENDANCE_VIEW_TEAM],
        },
        {
          id: 'tl-perf',
          title: 'Performance Overview',
          icon: 'TrendingUp',
          path: '/team-lead/performance',
          roles: [Role.TEAM_LEAD],
        },
      ],
    },
  ],

  [Role.EMPLOYEE]: [
    {
      groupTitle: 'My Portal',
      items: [
        {
          id: 'emp-dash',
          title: 'Dashboard',
          icon: 'LayoutDashboard',
          path: '/employee/dashboard',
          roles: [Role.EMPLOYEE],
        },
        {
          id: 'emp-profile',
          title: 'My Profile',
          icon: 'User',
          path: '/employee/profile',
          roles: [Role.EMPLOYEE],
        },
        {
          id: 'emp-att',
          title: 'My Attendance',
          icon: 'Clock',
          path: '/employee/attendance',
          roles: [Role.EMPLOYEE],
        },
        {
          id: 'emp-leave',
          title: 'My Leave',
          icon: 'FileText',
          path: '/employee/leave',
          roles: [Role.EMPLOYEE],
        },
        {
          id: 'emp-perf',
          title: 'My Performance',
          icon: 'TrendingUp',
          path: '/employee/performance',
          roles: [Role.EMPLOYEE],
        },
        {
          id: 'emp-docs',
          title: 'My Documents',
          icon: 'Folder',
          path: '/employee/profile#documents',
          roles: [Role.EMPLOYEE],
        },
      ],
    },
  ],
};
