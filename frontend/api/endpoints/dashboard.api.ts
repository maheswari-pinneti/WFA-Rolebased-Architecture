import dashboardData from '../../mocks/data/dashboard.json';
import { Role } from '../../security/roles/roles';

export const dashboardApi = {
  getRoleDashboardMetrics: async (role: Role) => {
    await new Promise((res) => setTimeout(res, 200));
    switch (role) {
      case Role.ADMIN:
        return dashboardData.admin;
      case Role.HR:
        return dashboardData.hr;
      case Role.MANAGER:
        return dashboardData.manager;
      case Role.TEAM_LEAD:
        return dashboardData.lead;
      case Role.EMPLOYEE:
      default:
        return dashboardData.employee;
    }
  }
};
