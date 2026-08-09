import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../../security/guards/ProtectedRoute';
import { RoleGuard } from '../../security/guards/RoleGuard';
import { MainLayout } from '../../shared/layouts/MainLayout';
import { LoginPage } from '../../auth/pages/LoginPage';
import { SignUpPage } from '../../auth/pages/SignUpPage';
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
import { TeamsManagement } from '../../features/admin/pages/TeamsManagement';
import { OrganizationHierarchy } from '../../features/admin/pages/OrganizationHierarchy';
import { AdminAttendanceOverview } from '../../features/admin/pages/AdminAttendanceOverview';
import { AdminAttendanceHistory } from '../../features/admin/pages/AdminAttendanceHistory';
import { AdminShifts } from '../../features/admin/pages/AdminShifts';
import { AdminCorrections } from '../../features/admin/pages/AdminCorrections';
import { AdminApprovals } from '../../features/admin/pages/AdminApprovals';
import { AdminSkillsOverview } from '../../features/admin/pages/AdminSkillsOverview';
import { AdminSkillsCoverage } from '../../features/admin/pages/AdminSkillsCoverage';
import { AdminPerformanceOverview } from '../../features/admin/pages/AdminPerformanceOverview';
import { AdminProductivityMetrics } from '../../features/admin/pages/AdminProductivityMetrics';
import { AdminAccessControl } from '../../features/admin/pages/AdminAccessControl';
import { AdminGeofencing } from '../../features/admin/pages/AdminGeofencing';

// HR Dashboards & Pages
import { HRDashboard } from '../../features/hr/pages/HRDashboard';
import { EmployeeManagement } from '../../features/hr/pages/EmployeeManagement';
import { AttendanceManagement } from '../../features/hr/pages/AttendanceManagement';
import { RecruitmentManagement } from '../../features/hr/pages/RecruitmentManagement';
import { LeaveManagement } from '../../features/hr/pages/LeaveManagement';
import { PayrollReports } from '../../features/hr/pages/PayrollReports';
import { HRReports } from '../../features/hr/pages/HRReports';
import { HRRecruitmentAnalytics } from '../../features/hr/pages/HRRecruitmentAnalytics';
import { HRWorkforcePlanning } from '../../features/hr/pages/HRWorkforcePlanning';
import { HRDepartments } from '../../features/hr/pages/HRDepartments';
import { HRTeams } from '../../features/hr/pages/HRTeams';
import { HRAttendanceOverview } from '../../features/hr/pages/HRAttendanceOverview';
import { HRAttendanceHistory } from '../../features/hr/pages/HRAttendanceHistory';
import { HRShifts } from '../../features/hr/pages/HRShifts';
import { HRCorrections } from '../../features/hr/pages/HRCorrections';
import { HRApprovals } from '../../features/hr/pages/HRApprovals';
import { HRSkillsOverview } from '../../features/hr/pages/HRSkillsOverview';
import { HRSkillsCoverage } from '../../features/hr/pages/HRSkillsCoverage';
import { HRPerformanceOverview } from '../../features/hr/pages/HRPerformanceOverview';
import { HRProductivityMetrics } from '../../features/hr/pages/HRProductivityMetrics';
import { HRAuditLogs } from '../../features/hr/pages/HRAuditLogs';
import { HRSettings } from '../../features/hr/pages/HRSettings';

// Manager Dashboards & Pages
import { ManagerDashboard } from '../../features/team-manager/pages/ManagerDashboard';
import { TeamAnalytics } from '../../features/team-manager/pages/TeamAnalytics';
import { TeamReports } from '../../features/team-manager/pages/TeamReports';
import { ApprovalsPage } from '../../features/team-manager/pages/ApprovalsPage';
import { DeptHeadDashboard } from '../../features/team-manager/pages/DeptHeadDashboard';

// Analytics Sub-pages
import { ProductivityAnalyticsPage } from '../../features/analytics/pages/ProductivityAnalyticsPage';
import { SkillsAnalyticsPage } from '../../features/analytics/pages/SkillsAnalyticsPage';
import { RiskAnalyticsPage } from '../../features/analytics/pages/RiskAnalyticsPage';

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

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-[#0e1726]/40 backdrop-blur-md border border-slate-800 rounded-3xl">
      <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mb-4 border border-blue-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
      <h2 className="text-xl font-bold mb-2 text-slate-100">{title}</h2>
      <p className="text-sm text-slate-400 max-w-sm">This module is fully configured inside the Stackly routing system. Functional components will load dynamically here.</p>
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
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
                <Route path="/admin/dashboard" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<AdminDashboard />} />} />
                <Route path="/admin/users" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<UserManagement />} />} />
                <Route path="/admin/roles" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<RoleManagement />} />} />
                <Route path="/admin/permissions" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<PermissionsManagement />} />} />
                <Route path="/admin/employees" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<EmployeeManagement />} />} />
                <Route path="/admin/departments" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<DepartmentsManagement />} />} />
                <Route path="/admin/locations" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<LocationsManagement />} />} />
                <Route path="/admin/analytics" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<TeamAnalytics />} />} />
                <Route path="/admin/reports" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<HRReports />} />} />
                <Route path="/admin/audit-logs" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<AuditLogsPage />} />} />
                <Route path="/admin/settings" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<SystemSettings />} />} />
                <Route path="/admin/configuration" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<SystemConfiguration />} />} />
                
                {/* Placeholder Admin Pages */}
                <Route path="/admin/productivity" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<ProductivityAnalyticsPage />} />} />
                <Route path="/admin/skills-gaps" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<SkillsAnalyticsPage />} />} />
                <Route path="/admin/risk" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<RiskAnalyticsPage />} />} />
                <Route path="/admin/teams" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<TeamsManagement />} />} />
                <Route path="/admin/organization" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<OrganizationHierarchy />} />} />
                <Route path="/admin/attendance-overview" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<AdminAttendanceOverview />} />} />
                <Route path="/admin/attendance-history" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<AdminAttendanceHistory />} />} />
                <Route path="/admin/shifts" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<AdminShifts />} />} />
                <Route path="/admin/corrections" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<AdminCorrections />} />} />
                <Route path="/admin/approvals" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<AdminApprovals />} />} />
                <Route path="/admin/skills-overview" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<AdminSkillsOverview />} />} />
                <Route path="/admin/skills-coverage" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<AdminSkillsCoverage />} />} />
                <Route path="/admin/performance-overview" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<AdminPerformanceOverview />} />} />
                <Route path="/admin/productivity-metrics" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<AdminProductivityMetrics />} />} />
                <Route path="/admin/access-control" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<AdminAccessControl />} />} />
                <Route path="/admin/geofencing" element={<RoleGuard allowedRoles={[Role.ADMIN]} children={<AdminGeofencing />} />} />

                {/* ==================== 2. HR ROUTES ==================== */}
                <Route path="/hr/dashboard" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<HRDashboard />} />} />
                <Route path="/hr/employees" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<EmployeeManagement />} />} />
                <Route path="/hr/recruitment" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<RecruitmentManagement />} />} />
                <Route path="/hr/attendance" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<AttendanceManagement />} />} />
                <Route path="/hr/leave" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<LeaveManagement />} />} />
                <Route path="/hr/performance" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<HRReports />} />} />
                <Route path="/hr/payroll-reports" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<PayrollReports />} />} />
                <Route path="/hr/workforce-analytics" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<TeamAnalytics />} />} />
                <Route path="/hr/reports" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<HRReports />} />} />
                
                {/* Placeholder HR Pages */}
                <Route path="/hr/recruitment-analytics" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<HRRecruitmentAnalytics />} />} />
                <Route path="/hr/workforce-planning" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<HRWorkforcePlanning />} />} />
                <Route path="/hr/productivity" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<ProductivityAnalyticsPage />} />} />
                <Route path="/hr/skills-gaps" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<SkillsAnalyticsPage />} />} />
                <Route path="/hr/risk" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<RiskAnalyticsPage />} />} />
                <Route path="/hr/departments" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<HRDepartments />} />} />
                <Route path="/hr/teams" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<HRTeams />} />} />
                <Route path="/hr/attendance-overview" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<HRAttendanceOverview />} />} />
                <Route path="/hr/attendance-history" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<HRAttendanceHistory />} />} />
                <Route path="/hr/shifts" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<HRShifts />} />} />
                <Route path="/hr/corrections" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<HRCorrections />} />} />
                <Route path="/hr/approvals" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<HRApprovals />} />} />
                <Route path="/hr/skills-overview" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<HRSkillsOverview />} />} />
                <Route path="/hr/skills-coverage" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<HRSkillsCoverage />} />} />
                <Route path="/hr/performance-overview" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<HRPerformanceOverview />} />} />
                <Route path="/hr/productivity-metrics" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<HRProductivityMetrics />} />} />
                <Route path="/hr/audit-logs" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<HRAuditLogs />} />} />
                <Route path="/hr/settings" element={<RoleGuard allowedRoles={[Role.HR, Role.ADMIN]} children={<HRSettings />} />} />

                {/* ==================== 3. DEPARTMENT MANAGER ROUTES ==================== */}
                <Route path="/manager/dashboard" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]} children={<ManagerDashboard />} />} />
                <Route path="/manager/team" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]} children={<DeptHeadDashboard />} />} />
                <Route path="/manager/analytics" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]} children={<TeamAnalytics />} />} />
                <Route path="/manager/attendance" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]} children={<AttendanceManagement />} />} />
                <Route path="/manager/leave-requests" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]} children={<ApprovalsPage />} />} />
                <Route path="/manager/approvals" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]} children={<ApprovalsPage />} />} />
                <Route path="/manager/performance" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]} children={<TeamReports />} />} />
                <Route path="/manager/reports" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]} children={<TeamReports />} />} />
                <Route path="/manager/productivity" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]} children={<ProductivityAnalyticsPage />} />} />
                
                {/* Placeholder Manager Pages */}
                <Route path="/manager/attendance-analytics" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]} children={<PlaceholderPage title="Team Attendance Trends" />} />} />
                <Route path="/manager/skills-gaps" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]} children={<SkillsAnalyticsPage />} />} />
                <Route path="/manager/team-members" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]} children={<PlaceholderPage title="Direct Reports List" />} />} />
                <Route path="/manager/team-overview" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]} children={<PlaceholderPage title="Department Overview Map" />} />} />
                <Route path="/manager/team-attendance" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]} children={<PlaceholderPage title="Team Attendance Overview" />} />} />
                <Route path="/manager/attendance-history" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]} children={<PlaceholderPage title="Team Attendance History" />} />} />
                <Route path="/manager/corrections" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]} children={<PlaceholderPage title="Corrections Approvals Queue" />} />} />
                <Route path="/manager/team-skills" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]} children={<PlaceholderPage title="Team Skills Matrix" />} />} />
                <Route path="/manager/skills-gaps-view" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]} children={<SkillsAnalyticsPage />} />} />
                <Route path="/manager/skills-coverage" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]} children={<PlaceholderPage title="Department Skill Coverage" />} />} />
                <Route path="/manager/team-performance" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]} children={<PlaceholderPage title="Team Appraisals Dashboard" />} />} />
                <Route path="/manager/productivity-metrics" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]} children={<PlaceholderPage title="Department Productivity Insights" />} />} />
                <Route path="/manager/shifts" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]} children={<PlaceholderPage title="Team Shift Rotations" />} />} />
                <Route path="/manager/settings" element={<RoleGuard allowedRoles={[Role.MANAGER, Role.ADMIN]} children={<PlaceholderPage title="Manager Portal Settings" />} />} />

                {/* ==================== 4. TEAM LEAD ROUTES ==================== */}
                <Route path="/team/dashboard" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<TeamLeadDashboard />} />} />
                <Route path="/team/members" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<TeamMembersPage />} />} />
                <Route path="/team/attendance" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<MyAttendance />} />} />
                <Route path="/team/goals" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<TaskTrackingPage />} />} />
                <Route path="/team/analytics" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<Productivity />} />} />

                <Route path="/team-lead/dashboard" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<TeamLeadDashboard />} />} />
                <Route path="/team-lead/tasks" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<TaskTrackingPage />} />} />
                <Route path="/team-lead/attendance" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<MyAttendance />} />} />
                <Route path="/team-lead/productivity" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<ProductivityAnalyticsPage />} />} />
                <Route path="/team-lead/performance" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<TeamMembersPage />} />} />
                <Route path="/team-lead/feedback" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<FeedbackManagement />} />} />
                
                {/* Placeholder Team Lead Pages */}
                <Route path="/team-lead/attendance-analytics" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<PlaceholderPage title="Team Attendance Analysis" />} />} />
                <Route path="/team-lead/workforce-analytics" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<PlaceholderPage title="Team Analytics Dashboard" />} />} />
                <Route path="/team-lead/team-members" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<PlaceholderPage title="Team Members List" />} />} />
                <Route path="/team-lead/team-overview" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<PlaceholderPage title="Team Graph Structure" />} />} />
                <Route path="/team-lead/team-attendance" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<PlaceholderPage title="Operational Attendance logs" />} />} />
                <Route path="/team-lead/attendance-history" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<PlaceholderPage title="Team History Archive" />} />} />
                <Route path="/team-lead/corrections" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<PlaceholderPage title="Team Corrections Requests" />} />} />
                <Route path="/team-lead/approvals" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<PlaceholderPage title="Lead Approvals Center" />} />} />
                <Route path="/team-lead/team-skills" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<PlaceholderPage title="Team Skills Map" />} />} />
                <Route path="/team-lead/skills-gaps" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<SkillsAnalyticsPage />} />} />
                <Route path="/team-lead/team-performance" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<PlaceholderPage title="Performance Reviews" />} />} />
                <Route path="/team-lead/shifts" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<PlaceholderPage title="Shift Rotas" />} />} />
                <Route path="/team-lead/reports" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<PlaceholderPage title="Operational Performance Reports" />} />} />
                <Route path="/team-lead/settings" element={<RoleGuard allowedRoles={[Role.TEAM_LEAD, Role.ADMIN]} children={<PlaceholderPage title="Lead Settings" />} />} />

                {/* ==================== 5. EMPLOYEE ROUTES ==================== */}
                <Route path="/me/dashboard" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.TEAM_LEAD, Role.MANAGER, Role.HR, Role.ADMIN]} children={<EmployeeDashboard />} />} />
                <Route path="/me/profile" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.TEAM_LEAD, Role.MANAGER, Role.HR, Role.ADMIN]} children={<Profile />} />} />
                <Route path="/me/attendance" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]} children={<MyAttendance />} />} />
                <Route path="/me/leave" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]} children={<EmployeeRequestsPage />} />} />
                <Route path="/me/performance" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]} children={<MyPerformance />} />} />
                <Route path="/me/notifications" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]} children={<EmployeeDashboard />} />} />

                <Route path="/employee/dashboard" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.TEAM_LEAD, Role.MANAGER, Role.HR, Role.ADMIN]} children={<EmployeeDashboard />} />} />
                <Route path="/employee/profile" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.TEAM_LEAD, Role.MANAGER, Role.HR, Role.ADMIN]} children={<Profile />} />} />
                <Route path="/employee/attendance" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]} children={<MyAttendance />} />} />
                <Route path="/employee/leave" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]} children={<EmployeeRequestsPage />} />} />
                <Route path="/employee/performance" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]} children={<MyPerformance />} />} />
                <Route path="/employee/goals" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]} children={<MyGoalsPage />} />} />
                <Route path="/employee/payslips" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]} children={<PayslipsPage />} />} />
                
                {/* Placeholder Employee Pages */}
                <Route path="/employee/attendance-today" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]} children={<PlaceholderPage title="Today's Attendance Status" />} />} />
                <Route path="/employee/check-in-out" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]} children={<MyAttendance />} />} />
                <Route path="/employee/break" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]} children={<MyAttendance />} />} />
                <Route path="/employee/working-hours" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]} children={<PlaceholderPage title="Working Hours Log" />} />} />
                <Route path="/employee/shifts" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]} children={<PlaceholderPage title="Shift Rosters & Calendars" />} />} />
                <Route path="/employee/skills" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]} children={<SkillsAnalyticsPage />} />} />
                <Route path="/employee/skills-coverage" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]} children={<SkillsAnalyticsPage />} />} />
                <Route path="/employee/skills-gaps" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]} children={<SkillsAnalyticsPage />} />} />
                <Route path="/employee/corrections" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]} children={<PlaceholderPage title="My Correction Submissions" />} />} />
                <Route path="/employee/settings" element={<RoleGuard allowedRoles={[Role.EMPLOYEE, Role.ADMIN]} children={<PlaceholderPage title="Employee Settings" />} />} />

                {/* Dedicated Error Pages Routes */}
                <Route path="/404" element={<RoleGuard allowedRoles={[Role.ADMIN, Role.HR, Role.MANAGER, Role.TEAM_LEAD, Role.EMPLOYEE]} children={<NotFoundPage />} />} />
                <Route path="/403" element={<RoleGuard allowedRoles={[Role.ADMIN, Role.HR, Role.MANAGER, Role.TEAM_LEAD, Role.EMPLOYEE]} children={<AccessDeniedPage />} />} />
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
                <Route path="*" element={<RoleGuard allowedRoles={[Role.ADMIN, Role.HR, Role.MANAGER, Role.TEAM_LEAD, Role.EMPLOYEE]} children={<NotFoundPage />} />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
