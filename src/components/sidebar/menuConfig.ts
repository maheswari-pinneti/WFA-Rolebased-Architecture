import { Role } from '../../security/roles/roles';
import { Permission } from '../../security/permissions/permissions';
import { MenuGroupConfig } from './types';

export const roleBasedMenuConfigurations: Record<Role, MenuGroupConfig[]> = {
  [Role.ADMIN]: [
    {
      groupTitle: 'Dashboard',
      items: [
        {
          id: 'admin-exec-overview',
          title: 'Executive Overview',
          icon: 'LayoutDashboard',
          path: '/admin/dashboard',
          roles: [Role.ADMIN],
          permissions: [Permission.SYSTEM_CONFIG],
        },
        {
          id: 'admin-workforce-kpis',
          title: 'Workforce KPIs',
          icon: 'PieChart',
          path: '/admin/dashboard#kpis',
          roles: [Role.ADMIN],
        },
        {
          id: 'admin-org-analytics',
          title: 'Organization Analytics',
          icon: 'BarChart3',
          path: '/admin/analytics',
          roles: [Role.ADMIN],
          permissions: [Permission.REPORT_VIEW_ALL],
        },
        {
          id: 'admin-realtime-insights',
          title: 'Real-Time Insights',
          icon: 'Zap',
          path: '/admin/dashboard#insights',
          roles: [Role.ADMIN],
          badge: { text: 'Live', variant: 'emerald' },
        },
      ],
    },
    {
      groupTitle: 'User Management',
      items: [
        {
          id: 'admin-all-users',
          title: 'All Users',
          icon: 'UserCog',
          path: '/admin/users',
          roles: [Role.ADMIN],
          permissions: [Permission.USER_MANAGE],
          badge: { text: 'Active', variant: 'blue' },
        },
        {
          id: 'admin-create-user',
          title: 'Create User',
          icon: 'UserPlus',
          path: '/admin/users#create',
          roles: [Role.ADMIN],
          permissions: [Permission.USER_CREATE],
        },
        {
          id: 'admin-user-directory',
          title: 'User Directory',
          icon: 'Users',
          path: '/admin/users#directory',
          roles: [Role.ADMIN],
          permissions: [Permission.USER_MANAGE],
        },
      ],
    },
    {
      groupTitle: 'Role & Permissions',
      items: [
        {
          id: 'admin-roles',
          title: 'Roles',
          icon: 'ShieldCheck',
          path: '/admin/roles',
          roles: [Role.ADMIN],
          permissions: [Permission.ROLE_MANAGE],
        },
        {
          id: 'admin-permissions',
          title: 'Permissions',
          icon: 'Lock',
          path: '/admin/permissions',
          roles: [Role.ADMIN],
          permissions: [Permission.ROLE_MANAGE],
        },
        {
          id: 'admin-access-matrix',
          title: 'Access Control Matrix',
          icon: 'Layers',
          path: '/admin/permissions#matrix',
          roles: [Role.ADMIN],
          permissions: [Permission.ROLE_MANAGE],
        },
      ],
    },
    {
      groupTitle: 'Organization Structure',
      items: [
        {
          id: 'admin-depts',
          title: 'Departments',
          icon: 'Building2',
          path: '/admin/departments',
          roles: [Role.ADMIN],
        },
        {
          id: 'admin-teams',
          title: 'Teams',
          icon: 'Users',
          path: '/admin/teams',
          roles: [Role.ADMIN],
        },
        {
          id: 'admin-locations',
          title: 'Locations',
          icon: 'MapPin',
          path: '/admin/locations',
          roles: [Role.ADMIN],
        },
      ],
    },
    {
      groupTitle: 'Workforce Analytics',
      items: [
        {
          id: 'admin-emp-directory',
          title: 'Employee Directory',
          icon: 'UserCheck',
          path: '/admin/employees',
          roles: [Role.ADMIN],
          permissions: [Permission.EMPLOYEE_VIEW_ALL],
        },
        {
          id: 'admin-attrition-analytics',
          title: 'Attrition Analytics',
          icon: 'TrendingDown',
          path: '/admin/analytics#attrition',
          roles: [Role.ADMIN],
          permissions: [Permission.REPORT_VIEW_ALL],
        },
        {
          id: 'admin-workforce-trends',
          title: 'Workforce Trends',
          icon: 'TrendingUp',
          path: '/admin/analytics#trends',
          roles: [Role.ADMIN],
          permissions: [Permission.REPORT_VIEW_ALL],
        },
      ],
    },
    {
      groupTitle: 'System Settings',
      items: [
        {
          id: 'admin-audit-logs',
          title: 'Audit Logs',
          icon: 'History',
          path: '/admin/audit-logs',
          roles: [Role.ADMIN],
          permissions: [Permission.AUDIT_LOG_VIEW],
          badge: { text: 'Stream', variant: 'emerald' },
        },
        {
          id: 'admin-settings',
          title: 'System Settings',
          icon: 'Sliders',
          path: '/admin/settings',
          roles: [Role.ADMIN],
          permissions: [Permission.SYSTEM_CONFIG],
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
          title: 'HR Overview',
          icon: 'LayoutDashboard',
          path: '/hr/dashboard',
          roles: [Role.HR],
        },
        {
          id: 'hr-workforce-summary',
          title: 'Workforce Summary',
          icon: 'BarChart3',
          path: '/hr/dashboard#summary',
          roles: [Role.HR],
        },
      ],
    },
    {
      groupTitle: 'Employee Management',
      items: [
        {
          id: 'hr-emp-directory',
          title: 'Employee Directory',
          icon: 'Users',
          path: '/hr/employees',
          roles: [Role.HR],
          permissions: [Permission.EMPLOYEE_VIEW],
        },
        {
          id: 'hr-recruitment',
          title: 'Recruitment & Candidates',
          icon: 'Briefcase',
          path: '/hr/recruitment',
          roles: [Role.HR],
          badge: { text: 'Hiring', variant: 'purple' },
        },
      ],
    },
    {
      groupTitle: 'Attendance & Leave',
      items: [
        {
          id: 'hr-attendance-overview',
          title: 'Attendance Overview',
          icon: 'Clock',
          path: '/hr/attendance',
          roles: [Role.HR],
          permissions: [Permission.ATTENDANCE_VIEW_ALL],
        },
        {
          id: 'hr-leave-mgmt',
          title: 'Leave Management',
          icon: 'FileText',
          path: '/hr/leave',
          roles: [Role.HR],
          badge: { text: '5 Pending', variant: 'rose' },
        },
      ],
    },
    {
      groupTitle: 'Performance & Reports',
      items: [
        {
          id: 'hr-performance',
          title: 'Performance Evaluation',
          icon: 'TrendingUp',
          path: '/hr/performance',
          roles: [Role.HR],
          permissions: [Permission.PERFORMANCE_MANAGE],
        },
        {
          id: 'hr-reports',
          title: 'Employee Reports',
          icon: 'FileSpreadsheet',
          path: '/hr/reports',
          roles: [Role.HR],
          permissions: [Permission.REPORT_VIEW],
        },
      ],
    },
  ],

  [Role.MANAGER]: [
    {
      groupTitle: 'Department Scope',
      items: [
        {
          id: 'mgr-dash',
          title: 'Department Overview',
          icon: 'LayoutDashboard',
          path: '/manager/dashboard',
          roles: [Role.MANAGER],
        },
        {
          id: 'mgr-dept-employees',
          title: 'Department Employees',
          icon: 'Building2',
          path: '/manager/team',
          roles: [Role.MANAGER],
        },
        {
          id: 'mgr-analytics',
          title: 'Department Analytics',
          icon: 'BarChart3',
          path: '/manager/analytics',
          roles: [Role.MANAGER],
        },
      ],
    },
    {
      groupTitle: 'Team & Approvals',
      items: [
        {
          id: 'mgr-attendance',
          title: 'Team Attendance',
          icon: 'Clock',
          path: '/manager/attendance',
          roles: [Role.MANAGER],
          permissions: [Permission.ATTENDANCE_VIEW_TEAM],
        },
        {
          id: 'mgr-leave-approvals',
          title: 'Leave Approvals',
          icon: 'CheckCircle2',
          path: '/manager/approvals',
          roles: [Role.MANAGER],
          badge: { text: '3 Review', variant: 'amber' },
        },
        {
          id: 'mgr-performance-reviews',
          title: 'Performance Reviews',
          icon: 'TrendingUp',
          path: '/manager/performance',
          roles: [Role.MANAGER],
          permissions: [Permission.PERFORMANCE_REVIEW],
        },
      ],
    },
  ],

  [Role.TEAM_LEAD]: [
    {
      groupTitle: 'Team Scope',
      items: [
        {
          id: 'tl-dash',
          title: 'Team Overview',
          icon: 'LayoutDashboard',
          path: '/team-lead/dashboard',
          roles: [Role.TEAM_LEAD],
        },
        {
          id: 'tl-tasks',
          title: 'Task & Productivity',
          icon: 'ClipboardList',
          path: '/team-lead/tasks',
          roles: [Role.TEAM_LEAD],
          badge: { text: '8 Active', variant: 'rose' },
        },
        {
          id: 'tl-attendance',
          title: 'Team Attendance',
          icon: 'Clock',
          path: '/team-lead/attendance',
          roles: [Role.TEAM_LEAD],
          permissions: [Permission.ATTENDANCE_VIEW_TEAM],
        },
        {
          id: 'tl-perf',
          title: 'Team Performance',
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
          title: 'My Dashboard',
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
          id: 'emp-attendance',
          title: 'My Attendance',
          icon: 'Clock',
          path: '/employee/attendance',
          roles: [Role.EMPLOYEE],
        },
        {
          id: 'emp-leave-requests',
          title: 'Leave Requests',
          icon: 'FileText',
          path: '/employee/leave',
          roles: [Role.EMPLOYEE],
        },
        {
          id: 'emp-performance',
          title: 'My Performance',
          icon: 'TrendingUp',
          path: '/employee/performance',
          roles: [Role.EMPLOYEE],
        },
        {
          id: 'emp-goals',
          title: 'My Goals',
          icon: 'Target',
          path: '/employee/goals',
          roles: [Role.EMPLOYEE],
        },
        {
          id: 'emp-payslips',
          title: 'Payslip View',
          icon: 'DollarSign',
          path: '/employee/payslips',
          roles: [Role.EMPLOYEE],
        },
      ],
    },
  ],
};
