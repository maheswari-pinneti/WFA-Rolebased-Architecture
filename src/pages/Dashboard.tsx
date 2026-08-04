import React from 'react';
import { useAuth } from '../auth/hooks/useAuth';
import { Role } from '../security/roles/roles';
import { AdminDashboard } from '../features/admin/pages/AdminDashboard';
import { HRDashboard } from '../features/hr/pages/HRDashboard';
import { ManagerDashboard } from '../features/team-manager/pages/ManagerDashboard';
import { TeamLeadDashboard } from '../features/team-lead/pages/TeamLeadDashboard';
import { EmployeeDashboard } from '../features/employee/pages/EmployeeDashboard';

export const Dashboard: React.FC = () => {
  const { role } = useAuth();

  switch (role) {
    case Role.ADMIN:
      return <AdminDashboard />;
    case Role.HR:
      return <HRDashboard />;
    case Role.MANAGER:
      return <ManagerDashboard />;
    case Role.TEAM_LEAD:
      return <TeamLeadDashboard />;
    case Role.EMPLOYEE:
    default:
      return <EmployeeDashboard />;
  }
};

export default Dashboard;
