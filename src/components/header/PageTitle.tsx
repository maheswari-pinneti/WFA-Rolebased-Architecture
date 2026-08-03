import React from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { Role } from '../../security/roles/roles';
import { useLocation } from 'react-router-dom';

export const PageTitle: React.FC = () => {
  const { role } = useAuth();
  const location = useLocation();

  const getTitleByRoute = () => {
    const path = location.pathname;
    if (path.includes('/admin/dashboard')) return 'Admin Control Console';
    if (path.includes('/admin/analytics')) return 'Workforce Analytics & Trends';
    if (path.includes('/admin/users')) return 'User & Security Access Management';
    if (path.includes('/hr/dashboard')) return 'HR Operations & Workforce Hub';
    if (path.includes('/manager/dashboard')) return 'Department Manager Hub';
    if (path.includes('/team-lead/dashboard')) return 'Team Lead Sprint & Productivity';
    if (path.includes('/employee/dashboard')) return 'Employee Self-Service Portal';

    switch (role) {
      case Role.ADMIN: return 'System Administrator Console';
      case Role.HR: return 'HR Operations Management';
      case Role.MANAGER: return 'Department Scope Overview';
      case Role.TEAM_LEAD: return 'Team Sprint Monitoring';
      case Role.EMPLOYEE: return 'Employee Portal';
      default: return 'Workforce Analytics Dashboard';
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <h1 className="text-sm md:text-base font-extrabold tracking-tight text-[var(--text-primary)] leading-tight">
        {getTitleByRoute()}
      </h1>
      <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
        Enterprise Workforce Intelligence
      </p>
    </div>
  );
};
