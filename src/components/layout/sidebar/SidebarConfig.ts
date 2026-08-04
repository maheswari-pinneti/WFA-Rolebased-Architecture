import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';

export interface SidebarSubItemConfig {
  label: string;
  path: string;
  badge?: {
    text: string;
    variant: 'blue' | 'purple' | 'amber' | 'emerald' | 'rose';
  };
}

export interface SidebarItemConfig {
  id: string;
  label: string;
  path: string;
  icon: string;
  roles: (Role | string)[];
  permissions?: (Permission | string)[];
  badge?: {
    text: string;
    variant: 'blue' | 'purple' | 'amber' | 'emerald' | 'rose';
  };
  children?: SidebarSubItemConfig[];
}

export interface SidebarGroupConfig {
  category: string;
  items: SidebarItemConfig[];
}

export const sidebarConfigData: SidebarGroupConfig[] = [
  {
    category: 'Dashboard',
    items: [
      {
        id: 'dash-overview',
        label: 'Overview',
        path: '/admin/dashboard',
        icon: 'LayoutDashboard',
        roles: [Role.ADMIN, Role.HR, Role.MANAGER, Role.TEAM_LEAD, Role.EMPLOYEE],
        children: [
          { label: 'Overview', path: '/admin/dashboard' },
          { label: 'Workforce Analytics', path: '/admin/analytics' },
          { label: 'KPI Dashboard', path: '/admin/dashboard#kpis' },
          { label: 'Reports', path: '/admin/reports' },
        ],
      },
    ],
  },
  {
    category: 'Employee Management',
    items: [
      {
        id: 'emp-mgmt',
        label: 'Employee Management',
        path: '/admin/employees',
        icon: 'Users',
        roles: [Role.ADMIN, Role.HR],
        badge: { text: 'Directory', variant: 'blue' },
        children: [
          { label: 'Employee Directory', path: '/admin/employees' },
          { label: 'Employee Profile', path: '/employee/profile' },
          { label: 'Employee Onboarding', path: '/admin/employees#onboarding' },
          { label: 'Employee Offboarding', path: '/admin/employees#offboarding' },
          { label: 'Attendance Management', path: '/hr/attendance' },
        ],
      },
    ],
  },
  {
    category: 'Workforce Analytics',
    items: [
      {
        id: 'wf-analytics',
        label: 'Workforce Analytics',
        path: '/admin/analytics',
        icon: 'BarChart3',
        roles: [Role.ADMIN, Role.HR, Role.MANAGER],
        badge: { text: 'Live', variant: 'emerald' },
        children: [
          { label: 'Workforce Overview', path: '/admin/analytics#overview' },
          { label: 'Department Analytics', path: '/admin/analytics#depts' },
          { label: 'Attendance Analytics', path: '/hr/attendance' },
          { label: 'Performance Analytics', path: '/hr/performance' },
          { label: 'Productivity Analytics', path: '/manager/productivity' },
          { label: 'Attrition Analytics', path: '/admin/analytics#attrition' },
        ],
      },
    ],
  },
  {
    category: 'Organization',
    items: [
      {
        id: 'org-mgmt',
        label: 'Organization',
        path: '/admin/departments',
        icon: 'Building2',
        roles: [Role.ADMIN, Role.HR, Role.MANAGER],
        children: [
          { label: 'Departments', path: '/admin/departments' },
          { label: 'Teams', path: '/manager/team' },
          { label: 'Locations', path: '/admin/locations' },
          { label: 'Organization Hierarchy', path: '/admin/departments#hierarchy' },
        ],
      },
    ],
  },
  {
    category: 'Reports',
    items: [
      {
        id: 'reports-center',
        label: 'Reports',
        path: '/admin/reports',
        icon: 'FileSpreadsheet',
        roles: [Role.ADMIN, Role.HR, Role.MANAGER],
        badge: { text: 'Export', variant: 'purple' },
        children: [
          { label: 'HR Reports', path: '/hr/reports' },
          { label: 'Manager Reports', path: '/manager/reports' },
          { label: 'Employee Reports', path: '/employee/reports' },
          { label: 'Export Center', path: '/admin/reports#export' },
        ],
      },
    ],
  },
  {
    category: 'Administration',
    items: [
      {
        id: 'admin-center',
        label: 'Administration',
        path: '/admin/users',
        icon: 'ShieldCheck',
        roles: [Role.ADMIN],
        badge: { text: 'Admin', variant: 'rose' },
        children: [
          { label: 'User Management', path: '/admin/users' },
          { label: 'Permission Management', path: '/admin/permissions' },
          { label: 'System Configuration', path: '/admin/configuration' },
          { label: 'Audit Logs', path: '/admin/audit-logs' },
        ],
      },
    ],
  },
  {
    category: 'My Workspace',
    items: [
      {
        id: 'my-workspace',
        label: 'My Workspace',
        path: '/employee/dashboard',
        icon: 'User',
        roles: [Role.ADMIN, Role.HR, Role.MANAGER, Role.TEAM_LEAD, Role.EMPLOYEE],
        children: [
          { label: 'My Dashboard', path: '/employee/dashboard' },
          { label: 'My Attendance', path: '/employee/attendance' },
          { label: 'My Performance', path: '/employee/performance' },
          { label: 'My Requests', path: '/employee/requests', badge: { text: '5', variant: 'rose' } },
        ],
      },
    ],
  },
];
