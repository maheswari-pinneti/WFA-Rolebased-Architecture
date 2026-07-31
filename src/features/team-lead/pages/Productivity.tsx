import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';
import { PerformanceChart } from '../../analytics/charts/PerformanceChart';

export const Productivity: React.FC = () => {
  return (
    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR, Role.MANAGER, Role.TEAM_LEAD]} requiredPermission={Permission.TEAM_ANALYTICS_VIEW}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Lead Productivity Matrix</h2>
          <p className="text-sm text-slate-400">Evaluate individual developer throughput and code quality trends</p>
        </div>

        <PerformanceChart />
      </div>
    </RoleGuard>
  );
};
