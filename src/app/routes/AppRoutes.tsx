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
import { UserManagement } from '../../features/admin/pages/UserManagement';
import { RoleManagement } from '../../features/admin/pages/RoleManagement';
import { PermissionsManagement } from '../../features/admin/pages/PermissionsManagement';
import { DepartmentsManagement } from '../../features/admin/pages/DepartmentsManagement';
import { LocationsManagement } from '../../features/admin/pages/LocationsManagement';
import { AuditLogsPage } from '../../features/admin/pages/AuditLogsPage';
import { SystemSettings } from '../../features/admin/pages/SystemSettings';
import { SystemConfiguration } from '../../features/admin/pages/SystemConfiguration';

// HR Dashboards & Pages
import { HRDashboard } from '../../features/hr/pages/HRDashboard';
import { EmployeeManagement } from '../../features/hr/pages/EmployeeManagement';
import { AttendanceManagement } from '../../features/hr/pages/AttendanceManagement';
import { RecruitmentManagement } from '../../features/hr/pages/RecruitmentManagement';
import { LeaveManagement } from '../../features/hr/pages/LeaveManagement';
import { PayrollReports } from '../../features/hr/pages/PayrollReports';
import { HRReports } from '../../features/hr/pages/HRReports';

// Manager Dashboards & Pages
import { ManagerDashboard } from '../../features/team-manager/pages/ManagerDashboard';
import { TeamAnalytics } from '../../features/team-manager/pages/TeamAnalytics';
import { TeamReports } from '../../features/team-manager/pages/TeamReports';
import { ApprovalsPage } from '../../features/team-manager/pages/ApprovalsPage';
import { DeptHeadDashboard } from '../../features/team-manager/pages/DeptHeadDashboard';

// Team Lead Dashboards & Pages
import { TeamLeadDashboard } from '../../features/team-lead/pages/TeamLeadDashboard';
import { TeamMembersPage } from '../../features/team-lead/pages/TeamMembersPage';
import { TaskTrackingPage } from '../../features/team-lead/pages/TaskTrackingPage';
import { Productivity } from '../../features/team-lead/pages/Productivity';
import { FeedbackManagement } from '../../features/team-lead/pages/FeedbackManagement';

// Employee Dashboards & Pages
import { EmployeeDashboard } from '../../features/employee/pages/EmployeeDashboard';
import { Profile } from '../../features/employee/pages/Profile';
import { MyAttendance } from '../../features/employee/pages/MyAttendance';
import { MyPerformance } from '../../features/employee/pages/MyPerformance';
import { EmployeeRequestsPage } from '../../features/employee/pages/EmployeeRequestsPage';
import { MyGoalsPage } from '../../features/employee/pages/MyGoalsPage';
import { PayslipsPage } from '../../features/employee/pages/PayslipsPage';

// Error Pages
import { NotFoundPage, AccessDeniedPage, ServerErrorPage } from '../../features/error';
import { Unauthorized } from '../../pages/Unauthorized';

const DefaultHomeRedirect: React.FC = () => {
  const { role } = useAuth();
  const target = ROLE_HOME_PATHS[role] || '/employee/dashboard';
  return <Navigate to={target} replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route path="/verify-email" element={<LoginPage />} />
      <Route path="/forgot-password" element={<LoginPage />} />

      {/* Protected Routes Enclosed in Enterprise MainLayout */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Routes>
                {/* ==================== 1. ADMIN ROUTES ==================== */}
                <Route path="/admin/dashboard" element={<RoleGuard allowedRoles={[Role.ADMIN]}><AdminDashboard /></RoleGuard>} />
                <Route path="/admin/users" element={<RoleGuard allowedRoles={[Role.ADMIN]}><UserManagement /></RoleGuard>} />
                <Route path="/admin/roles" element={<RoleGuard allowedRoles={[Role.ADMIN]}><RoleManagement /></RoleGuard>} />
                <Route path="/admin/permissions" element={<RoleGuard allowedRoles={[Role.ADMIN]}><PermissionsManagement /></RoleGuard>} />
                <Route path="/admin/employees" element={<RoleGuard allowedRoles={[Role.ADMIN]}><EmployeeManagement /></RoleGuard>} />
                <Route path="/admin/departments" element={<RoleGuard allowedRoles={[Role.ADMIN]}><DepartmentsManagement /></RoleGuard>} />
                <Route path="/admin/locations" element={<RoleGuard allowedRoles={[Role.ADMIN]}><LocationsManagement /></RoleGuard>} />
                <Route path="/admin/analytics" element={<RoleGuard allowedRoles={[Role.ADMIN]}><TeamAnalytics /></RoleGuard>} />
                <Route path="/admin/reports" element={<RoleGuard allowedRoles={[Role.ADMIN]}><HRReports /></RoleGuard>} />
                <Route path="/admin/audit-logs" element={<RoleGuard allowedRoles={[Role.ADMIN]}><AuditLogsPage /></RoleGuard>} />
                <Route path="/admin/settings" element={<RoleGuard allowedRoles={[Role.ADMIN]}><SystemSettings /></RoleGuard>} />
                <Route path="/admin/configuration" element={<RoleGuard allowedRoles={[Role.ADMIN]}><SystemConfiguration /></RoleGuard>} />

                {/* ==================== 2. HR ROUTES ==================== */}
                <Route path="/hr/dashboard" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]}><HRDashboard /></RoleGuard>} />
                <Route path="/hr/employees" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]}><EmployeeManagement /></RoleGuard>} />
                <Route path="/hr/recruitment" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]}><RecruitmentManagement /></RoleGuard>} />
                <Route path="/hr/attendance" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]}><AttendanceManagement /></RoleGuard>} />
                <Route path="/hr/leave" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]}><LeaveManagement /></RoleGuard>} />
                <Route path="/hr/performance" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]}><HRReports /></RoleGuard>} />
                <Route path="/hr/payroll-reports" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]}><PayrollReports /></RoleGuard>} />
                <Route path="/hr/workforce-analytics" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]}><TeamAnalytics /></RoleGuard>} />
                <Route path="/hr/reports" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]}><HRReports /></RoleGuard>} />

                {/* ==================== 3. DEPARTMENT MANAGER ROUTES ==================== */}
                <Route path="/manager/dashboard" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]}><ManagerDashboard /></RoleGuard>} />
                <Route path="/manager/team" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]}><DeptHeadDashboard /></RoleGuard>} />
                <Route path="/manager/analytics" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]}><TeamAnalytics /></RoleGuard>} />
                <Route path="/manager/attendance" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]}><AttendanceManagement /></RoleGuard>} />
                <Route path="/manager/leave-requests" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]}><ApprovalsPage /></RoleGuard>} />
                <Route path="/manager/approvals" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]}><ApprovalsPage /></RoleGuard>} />
                <Route path="/manager/performance" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]}><TeamReports /></RoleGuard>} />
                <Route path="/manager/reports" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]}><TeamReports /></RoleGuard>} />
                <Route path="/manager/productivity" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]}><Productivity /></RoleGuard>} />

                {/* ==================== 4. TEAM LEAD ROUTES (SPEC SECTION 16) ==================== */}
                <Route path="/team/dashboard" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]}><TeamLeadDashboard /></RoleGuard>} />
                <Route path="/team/members" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]}><TeamMembersPage /></RoleGuard>} />
                <Route path="/team/attendance" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]}><MyAttendance /></RoleGuard>} />
                <Route path="/team/goals" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]}><TaskTrackingPage /></RoleGuard>} />
                <Route path="/team/analytics" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]}><Productivity /></RoleGuard>} />

                <Route path="/team-lead/dashboard" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]}><TeamLeadDashboard /></RoleGuard>} />
                <Route path="/team-lead/tasks" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]}><TaskTrackingPage /></RoleGuard>} />
                <Route path="/team-lead/attendance" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]}><MyAttendance /></RoleGuard>} />
                <Route path="/team-lead/productivity" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]}><Productivity /></RoleGuard>} />
                <Route path="/team-lead/performance" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]}><TeamMembersPage /></RoleGuard>} />
                <Route path="/team-lead/feedback" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]}><FeedbackManagement /></RoleGuard>} />

                {/* ==================== 5. EMPLOYEE ROUTES (SPEC SECTION 16) ==================== */}
                <Route path="/me/dashboard" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.TEAM_LEAD, Role.MANAGER, Role.HR, Role.ADMIN]}><EmployeeDashboard /></RoleGuard>} />
                <Route path="/me/profile" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.TEAM_LEAD, Role.MANAGER, Role.HR, Role.ADMIN]}><Profile /></RoleGuard>} />
                <Route path="/me/attendance" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]}><MyAttendance /></RoleGuard>} />
                <Route path="/me/leave" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]}><EmployeeRequestsPage /></RoleGuard>} />
                <Route path="/me/performance" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]}><MyPerformance /></RoleGuard>} />
                <Route path="/me/notifications" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]}><EmployeeDashboard /></RoleGuard>} />

                <Route path="/employee/dashboard" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.TEAM_LEAD, Role.MANAGER, Role.HR, Role.ADMIN]}><EmployeeDashboard /></RoleGuard>} />
                <Route path="/employee/profile" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.TEAM_LEAD, Role.MANAGER, Role.HR, Role.ADMIN]}><Profile /></RoleGuard>} />
                <Route path="/employee/attendance" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]}><MyAttendance /></RoleGuard>} />
                <Route path="/employee/leave" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]}><EmployeeRequestsPage /></RoleGuard>} />
                <Route path="/employee/performance" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]}><MyPerformance /></RoleGuard>} />
                <Route path="/employee/goals" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]}><MyGoalsPage /></RoleGuard>} />
                <Route path="/employee/payslips" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]}><PayslipsPage /></RoleGuard>} />

                {/* Dedicated Error Pages Routes */}
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="/403" element={<AccessDeniedPage />} />
                <Route path="/500" element={<ServerErrorPage />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Legacy Root Paths Redirects */}
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/hr" element={<Navigate to="/hr/dashboard" replace />} />
                <Route path="/manager" element={<Navigate to="/manager/dashboard" replace />} />
                <Route path="/team-lead" element={<Navigate to="/team-lead/dashboard" replace />} />
                <Route path="/team" element={<Navigate to="/team/dashboard" replace />} />
                <Route path="/employee" element={<Navigate to="/employee/dashboard" replace />} />
                <Route path="/me" element={<Navigate to="/me/dashboard" replace />} />

                {/* Default Route Fallback */}
                <Route path="/" element={<DefaultHomeRedirect />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
