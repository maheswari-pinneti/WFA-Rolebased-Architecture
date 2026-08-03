import { Role } from '../../security/roles/roles';
import { Permission } from '../../security/permissions/permissions';
import { MenuGroupConfig } from './types';

export const roleBasedMenuConfigurations: Record<Role, MenuGroupConfig[]> = {
  [Role.ADMIN]: [
    {
      groupTitle: 'Dashboard',
      items: [
        {
          id: 'admin-overview',
          title: 'Organization Overview',
          icon: 'LayoutDashboard',
          path: '/admin/dashboard',
          roles: [Role.ADMIN],
          permissions: [Permission.SYSTEM_CONFIG],
        },
        {
          id: 'admin-workforce-analytics',
          title: 'Workforce Analytics',
          icon: 'BarChart3',
          path: '/admin/analytics',
          roles: [Role.ADMIN],
          permissions: [Permission.VIEW_REPORTS],
        },
        {
          id: 'admin-kpi-dash',
          title: 'KPI Dashboard',
          icon: 'PieChart',
          path: '/admin/dashboard#kpi',
          roles: [Role.ADMIN],
        },
      ],
    },
    {
      groupTitle: 'User Management',
      items: [
        {
          id: 'admin-users',
          title: 'Users',
          icon: 'UserCog',
          path: '/admin/users',
          roles: [Role.ADMIN],
          permissions: [Permission.MANAGE_USERS],
          badge: { text: 'Active', variant: 'blue' },
        },
        {
          id: 'admin-roles',
          title: 'Roles',
          icon: 'ShieldCheck',
          path: '/admin/roles',
          roles: [Role.ADMIN],
          permissions: [Permission.MANAGE_ROLES],
        },
        {
          id: 'admin-permissions',
          title: 'Permissions',
          icon: 'Lock',
          path: '/admin/permissions',
          roles: [Role.ADMIN],
          permissions: [Permission.MANAGE_ROLES],
        },
      ],
    },
    {
      groupTitle: 'Organization',
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
      groupTitle: 'Employee Management',
      items: [
        {
          id: 'admin-emp-directory',
          title: 'Employee Directory',
          icon: 'UserCheck',
          path: '/admin/employees',
          roles: [Role.ADMIN],
          permissions: [Permission.VIEW_EMPLOYEE],
        },
      ],
    },
    {
      groupTitle: 'System & Governance',
      items: [
        {
          id: 'admin-audit',
          title: 'Audit Logs',
          icon: 'History',
          path: '/admin/audit-logs',
          roles: [Role.ADMIN],
          permissions: [Permission.AUDIT_READ],
          badge: { text: 'Live', variant: 'emerald' },
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
      groupTitle: 'Core Operations',
      items: [
        {
          id: 'hr-dash',
          title: 'HR Dashboard',
          icon: 'LayoutDashboard',
          path: '/hr/dashboard',
          roles: [Role.HR],
        },
      ],
    },
    {
      groupTitle: 'Employees',
      items: [
        {
          id: 'hr-emp-directory',
          title: 'Employee Directory',
          icon: 'Users',
          path: '/hr/employees',
          roles: [Role.HR],
          permissions: [Permission.VIEW_EMPLOYEE],
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
      groupTitle: 'Workforce Operations',
      items: [
        {
          id: 'hr-attendance',
          title: 'Attendance Overview',
          icon: 'Clock',
          path: '/hr/attendance',
          roles: [Role.HR],
          permissions: [Permission.VIEW_ATTENDANCE],
        },
        {
          id: 'hr-leave',
          title: 'Leave Management',
          icon: 'FileText',
          path: '/hr/leave',
          roles: [Role.HR],
          badge: { text: '5 New', variant: 'rose' },
        },
        {
          id: 'hr-performance',
          title: 'Performance Evaluation',
          icon: 'TrendingUp',
          path: '/hr/performance',
          roles: [Role.HR],
          permissions: [Permission.VIEW_PERFORMANCE],
        },
        {
          id: 'hr-payroll',
          title: 'Payroll Reports',
          icon: 'DollarSign',
          path: '/hr/payroll-reports',
          roles: [Role.HR],
          permissions: [Permission.VIEW_PAYROLL],
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
          title: 'Manager Dashboard',
          icon: 'LayoutDashboard',
          path: '/manager/dashboard',
          roles: [Role.MANAGER],
        },
        {
          id: 'mgr-dept-overview',
          title: 'Department Overview',
          icon: 'Building2',
          path: '/manager/team',
          roles: [Role.MANAGER],
        },
        {
          id: 'mgr-dept-analytics',
          title: 'Department Analytics',
          icon: 'BarChart3',
          path: '/manager/analytics',
          roles: [Role.MANAGER],
        },
      ],
    },
    {
      groupTitle: 'Operations & Approvals',
      items: [
        {
          id: 'mgr-attendance',
          title: 'Team Attendance',
          icon: 'Clock',
          path: '/manager/attendance',
          roles: [Role.MANAGER],
          permissions: [Permission.VIEW_ATTENDANCE],
        },
        {
          id: 'mgr-approvals',
          title: 'Leave Approvals',
          icon: 'CheckCircle2',
          path: '/manager/approvals',
          roles: [Role.MANAGER],
          badge: { text: '3 Review', variant: 'amber' },
        },
        {
          id: 'mgr-perf-review',
          title: 'Performance Reviews',
          icon: 'TrendingUp',
          path: '/manager/performance',
          roles: [Role.MANAGER],
          permissions: [Permission.VIEW_PERFORMANCE],
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
          title: 'Team Dashboard',
          icon: 'LayoutDashboard',
          path: '/team-lead/dashboard',
          roles: [Role.TEAM_LEAD],
        },
        {
          id: 'tl-tasks',
          title: 'Task Status & Monitoring',
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
          permissions: [Permission.VIEW_ATTENDANCE],
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
      groupTitle: 'Personal Portal',
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
          id: 'emp-att',
          title: 'My Attendance',
          icon: 'Clock',
          path: '/employee/attendance',
          roles: [Role.EMPLOYEE],
        },
        {
          id: 'emp-leave',
          title: 'Leave Requests',
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
