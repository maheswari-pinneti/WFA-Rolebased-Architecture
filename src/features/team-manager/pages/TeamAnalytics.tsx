import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';
import { PerformanceChart } from '../../analytics/charts/PerformanceChart';
import { AttendanceChart } from '../../analytics/charts/AttendanceChart';

export const TeamAnalytics: React.FC = () => {
  return (
    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR, Role.TEAM_MANAGER]} requiredPermission={Permission.ANALYTICS_VIEW_TEAM}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Team Performance & Analytics</h2>
          <p className="text-sm text-slate-400">Deep-dive metrics into team output, commit velocity, and attendance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceChart />
          <AttendanceChart />
        </div>
      </div>
    </RoleGuard>
  );
};
