import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../../security/guards/ProtectedRoute';
import { RoleGuard } from '../../security/guards/RoleGuard';
import { MainLayout } from '../../shared/layouts/MainLayout';
import { LoginPage } from '../../auth/pages/LoginPage';
import { LogoutPage } from '../../auth/pages/LogoutPage';
import { Role, ROLE_HOME_PATHS } from '../../security/roles/roles';
import { useAuth } from '../../auth/hooks/useAuth';

// Admin Dashboards & Pages
import { AdminDashboard } from '../../features/admin/pages/AdminDashboard';
import { PlatformAdminDashboard } from '../../features/admin/pages/PlatformAdminDashboard';
import { SecurityAdminDashboard } from '../../features/admin/pages/SecurityAdminDashboard';
import { OrgAdminDashboard } from '../../features/admin/pages/OrgAdminDashboard';
import { AuditorDashboard } from '../../features/admin/pages/AuditorDashboard';
import { UserManagement } from '../../features/admin/pages/UserManagement';
import { RoleManagement } from '../../features/admin/pages/RoleManagement';
import { SystemSettings } from '../../features/admin/pages/SystemSettings';

// HR Dashboards & Pages
import { HRDashboard } from '../../features/hr/pages/HRDashboard';
import { HRSpecialistDashboard } from '../../features/hr/pages/HRSpecialistDashboard';
import { EmployeeManagement } from '../../features/hr/pages/EmployeeManagement';
import { AttendanceManagement } from '../../features/hr/pages/AttendanceManagement';
import { HRReports } from '../../features/hr/pages/HRReports';

// Management & Analytics Dashboards
import { DeptHeadDashboard } from '../../features/team-manager/pages/DeptHeadDashboard';
import { ManagerDashboard } from '../../features/team-manager/pages/ManagerDashboard';
import { TeamAnalytics } from '../../features/team-manager/pages/TeamAnalytics';
import { TeamReports } from '../../features/team-manager/pages/TeamReports';
import { ApprovalsPage } from '../../features/team-manager/pages/ApprovalsPage';
import { AnalystDashboard } from '../../features/analytics/pages/AnalystDashboard';

// Operational Team Lead Dashboard & Pages
import { TeamLeadDashboard } from '../../features/team-lead/pages/TeamLeadDashboard';
import { TeamMembersPage } from '../../features/team-lead/pages/TeamMembersPage';
import { TaskTrackingPage } from '../../features/team-lead/pages/TaskTrackingPage';
import { Productivity } from '../../features/team-lead/pages/Productivity';

// Employee & Viewer Dashboards & Pages
import { EmployeeDashboard } from '../../features/employee/pages/EmployeeDashboard';
import { ViewerDashboard } from '../../features/employee/pages/ViewerDashboard';
import { Profile } from '../../features/employee/pages/Profile';
import { MyAttendance } from '../../features/employee/pages/MyAttendance';
import { MyPerformance } from '../../features/employee/pages/MyPerformance';
import { EmployeeRequestsPage } from '../../features/employee/pages/EmployeeRequestsPage';

const DefaultHomeRedirect: React.FC = () => {
  const { role } = useAuth();
  const target = ROLE_HOME_PATHS[role] || '/employee';
  return <Navigate to={target} replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/logout" element={<LogoutPage />} />

      {/* Protected Routes Enclosed in Enterprise MainLayout */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Routes>
                {/* 1. SYSTEM ADMIN DASHBOARD */}
                <Route
                  path="/system-admin"
                  element={
                    <RoleGuard allowedRoles={[Role.SYSTEM_ADMIN]}>
                      <AdminDashboard />
                    </RoleGuard>
                  }
                />

                {/* 2. PLATFORM ADMIN DASHBOARD */}
                <Route
                  path="/platform-admin"
                  element={
                    <RoleGuard allowedRoles={[Role.PLATFORM_ADMIN, Role.SYSTEM_ADMIN]}>
                      <PlatformAdminDashboard />
                    </RoleGuard>
                  }
                />

                {/* 3. SECURITY ADMIN DASHBOARD */}
                <Route
                  path="/security-admin"
                  element={
                    <RoleGuard allowedRoles={[Role.SECURITY_ADMIN, Role.SYSTEM_ADMIN]}>
                      <SecurityAdminDashboard />
                    </RoleGuard>
                  }
                />

                {/* 4. ORGANIZATION ADMIN DASHBOARD */}
                <Route
                  path="/org-admin"
                  element={
                    <RoleGuard allowedRoles={[Role.ORGANIZATION_ADMIN, Role.SYSTEM_ADMIN]}>
                      <OrgAdminDashboard />
                    </RoleGuard>
                  }
                />

                {/* 5. HR ADMIN DASHBOARD */}
                <Route
                  path="/hr-admin"
                  element={
                    <RoleGuard allowedRoles={[Role.HR_ADMIN, Role.SYSTEM_ADMIN]}>
                      <HRDashboard />
                    </RoleGuard>
                  }
                />

                {/* 6. HR SPECIALIST DASHBOARD */}
                <Route
                  path="/hr-specialist"
                  element={
                    <RoleGuard allowedRoles={[Role.HR_SPECIALIST, Role.HR_ADMIN, Role.SYSTEM_ADMIN]}>
                      <HRSpecialistDashboard />
                    </RoleGuard>
                  }
                />

                {/* 7. DEPARTMENT HEAD DASHBOARD */}
                <Route
                  path="/dept-head"
                  element={
                    <RoleGuard allowedRoles={[Role.DEPARTMENT_HEAD, Role.SYSTEM_ADMIN]}>
                      <DeptHeadDashboard />
                    </RoleGuard>
                  }
                />

                {/* 8. BUSINESS MANAGER DASHBOARD */}
                <Route
                  path="/business-manager"
                  element={
                    <RoleGuard allowedRoles={[Role.BUSINESS_MANAGER, Role.SYSTEM_ADMIN]}>
                      <ManagerDashboard />
                    </RoleGuard>
                  }
                />

                {/* 9. TEAM LEAD DASHBOARD */}
                <Route
                  path="/team-lead"
                  element={
                    <RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.SYSTEM_ADMIN]}>
                      <TeamLeadDashboard />
                    </RoleGuard>
                  }
                />

                {/* 10. EMPLOYEE SELF SERVICE DASHBOARD */}
                <Route
                  path="/employee"
                  element={
                    <RoleGuard allowedRoles={[Role.EMPLOYEE, Role.SYSTEM_ADMIN]}>
                      <EmployeeDashboard />
                    </RoleGuard>
                  }
                />

                {/* 11. ANALYST BI DASHBOARD */}
                <Route
                  path="/analyst"
                  element={
                    <RoleGuard allowedRoles={[Role.ANALYST, Role.SYSTEM_ADMIN]}>
                      <AnalystDashboard />
                    </RoleGuard>
                  }
                />

                {/* 12. AUDITOR DASHBOARD */}
                <Route
                  path="/auditor"
                  element={
                    <RoleGuard allowedRoles={[Role.AUDITOR, Role.SYSTEM_ADMIN]}>
                      <AuditorDashboard />
                    </RoleGuard>
                  }
                />

                {/* 13. VIEWER READ-ONLY DASHBOARD */}
                <Route
                  path="/viewer"
                  element={
                    <RoleGuard allowedRoles={[Role.VIEWER, Role.SYSTEM_ADMIN]}>
                      <ViewerDashboard />
                    </RoleGuard>
                  }
                />

                {/* Shared Sub-Pages with Strict RBAC Control */}
                <Route
                  path="/admin/users"
                  element={
                    <RoleGuard allowedRoles={[Role.SYSTEM_ADMIN, Role.ORGANIZATION_ADMIN]}>
                      <UserManagement />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/roles"
                  element={
                    <RoleGuard allowedRoles={[Role.SYSTEM_ADMIN, Role.SECURITY_ADMIN]}>
                      <RoleManagement />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <RoleGuard allowedRoles={[Role.SYSTEM_ADMIN, Role.PLATFORM_ADMIN]}>
                      <SystemSettings />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <RoleGuard allowedRoles={[Role.SYSTEM_ADMIN, Role.SECURITY_ADMIN, Role.ORGANIZATION_ADMIN, Role.AUDITOR]}>
                      <HRReports />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/hr/employees"
                  element={
                    <RoleGuard allowedRoles={[Role.SYSTEM_ADMIN, Role.HR_ADMIN, Role.HR_SPECIALIST]}>
                      <EmployeeManagement />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/hr/attendance"
                  element={
                    <RoleGuard allowedRoles={[Role.SYSTEM_ADMIN, Role.HR_ADMIN, Role.HR_SPECIALIST]}>
                      <AttendanceManagement />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/hr/reports"
                  element={
                    <RoleGuard allowedRoles={[Role.SYSTEM_ADMIN, Role.HR_ADMIN]}>
                      <HRReports />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/manager/analytics"
                  element={
                    <RoleGuard allowedRoles={[Role.SYSTEM_ADMIN, Role.DEPARTMENT_HEAD, Role.BUSINESS_MANAGER, Role.ANALYST]}>
                      <TeamAnalytics />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/manager/approvals"
                  element={
                    <RoleGuard allowedRoles={[Role.SYSTEM_ADMIN, Role.BUSINESS_MANAGER]}>
                      <ApprovalsPage />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/manager/reports"
                  element={
                    <RoleGuard allowedRoles={[Role.SYSTEM_ADMIN, Role.DEPARTMENT_HEAD, Role.BUSINESS_MANAGER, Role.ANALYST]}>
                      <TeamReports />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/team-lead/members"
                  element={
                    <RoleGuard allowedRoles={[Role.SYSTEM_ADMIN, Role.TEAM_LEAD]}>
                      <TeamMembersPage />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/team-lead/productivity"
                  element={
                    <RoleGuard allowedRoles={[Role.SYSTEM_ADMIN, Role.TEAM_LEAD]}>
                      <Productivity />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/team-lead/tasks"
                  element={
                    <RoleGuard allowedRoles={[Role.SYSTEM_ADMIN, Role.TEAM_LEAD]}>
                      <TaskTrackingPage />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/employee/profile"
                  element={
                    <RoleGuard allowedRoles={[
                      Role.SYSTEM_ADMIN, Role.PLATFORM_ADMIN, Role.SECURITY_ADMIN,
                      Role.ORGANIZATION_ADMIN, Role.HR_ADMIN, Role.HR_SPECIALIST,
                      Role.DEPARTMENT_HEAD, Role.BUSINESS_MANAGER, Role.TEAM_LEAD,
                      Role.EMPLOYEE, Role.ANALYST, Role.AUDITOR, Role.VIEWER
                    ]}>
                      <Profile />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/employee/attendance"
                  element={
                    <RoleGuard allowedRoles={[Role.SYSTEM_ADMIN, Role.EMPLOYEE]}>
                      <MyAttendance />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/employee/performance"
                  element={
                    <RoleGuard allowedRoles={[Role.SYSTEM_ADMIN, Role.EMPLOYEE, Role.VIEWER]}>
                      <MyPerformance />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/employee/requests"
                  element={
                    <RoleGuard allowedRoles={[Role.SYSTEM_ADMIN, Role.EMPLOYEE]}>
                      <EmployeeRequestsPage />
                    </RoleGuard>
                  }
                />

                {/* Legacy Redirects */}
                <Route path="/admin" element={<Navigate to="/system-admin" replace />} />
                <Route path="/hr" element={<Navigate to="/hr-admin" replace />} />
                <Route path="/manager" element={<Navigate to="/business-manager" replace />} />

                {/* Default Route Fallback */}
                <Route path="/" element={<DefaultHomeRedirect />} />
                <Route path="*" element={<DefaultHomeRedirect />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
