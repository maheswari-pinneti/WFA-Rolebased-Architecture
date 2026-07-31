import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../../security/guards/ProtectedRoute';
import { RoleGuard } from '../../security/guards/RoleGuard';
import { MainLayout } from '../../shared/layouts/MainLayout';
import { LoginPage } from '../../auth/pages/LoginPage';
import { LogoutPage } from '../../auth/pages/LogoutPage';
import { Role } from '../../security/roles/roles';

// Admin Pages
import { AdminDashboard } from '../../features/admin/pages/AdminDashboard';
import { UserManagement } from '../../features/admin/pages/UserManagement';
import { RoleManagement } from '../../features/admin/pages/RoleManagement';
import { SystemSettings } from '../../features/admin/pages/SystemSettings';

// HR Pages
import { HRDashboard } from '../../features/hr/pages/HRDashboard';
import { EmployeeManagement } from '../../features/hr/pages/EmployeeManagement';
import { AttendanceManagement } from '../../features/hr/pages/AttendanceManagement';
import { HRReports } from '../../features/hr/pages/HRReports';

// Team Manager Pages
import { ManagerDashboard } from '../../features/team-manager/pages/ManagerDashboard';
import { TeamAnalytics } from '../../features/team-manager/pages/TeamAnalytics';
import { TeamReports } from '../../features/team-manager/pages/TeamReports';

// Team Lead Pages
import { TeamLeadDashboard } from '../../features/team-lead/pages/TeamLeadDashboard';
import { Productivity } from '../../features/team-lead/pages/Productivity';

// Employee Pages
import { EmployeeDashboard } from '../../features/employee/pages/EmployeeDashboard';
import { Profile } from '../../features/employee/pages/Profile';
import { MyAttendance } from '../../features/employee/pages/MyAttendance';
import { MyPerformance } from '../../features/employee/pages/MyPerformance';

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
                {/* Admin Role Routes */}
                <Route
                  path="/admin"
                  element={
                    <RoleGuard allowedRoles={[Role.ADMIN]}>
                      <AdminDashboard />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <RoleGuard allowedRoles={[Role.ADMIN]}>
                      <UserManagement />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/roles"
                  element={
                    <RoleGuard allowedRoles={[Role.ADMIN]}>
                      <RoleManagement />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <RoleGuard allowedRoles={[Role.ADMIN]}>
                      <SystemSettings />
                    </RoleGuard>
                  }
                />

                {/* HR Role Routes */}
                <Route
                  path="/hr"
                  element={
                    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR]}>
                      <HRDashboard />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/hr/employees"
                  element={
                    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR]}>
                      <EmployeeManagement />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/hr/attendance"
                  element={
                    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR]}>
                      <AttendanceManagement />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/hr/reports"
                  element={
                    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR]}>
                      <HRReports />
                    </RoleGuard>
                  }
                />

                {/* Team Manager Role Routes */}
                <Route
                  path="/manager"
                  element={
                    <RoleGuard allowedRoles={[Role.ADMIN, Role.TEAM_MANAGER]}>
                      <ManagerDashboard />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/manager/analytics"
                  element={
                    <RoleGuard allowedRoles={[Role.ADMIN, Role.TEAM_MANAGER]}>
                      <TeamAnalytics />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/manager/reports"
                  element={
                    <RoleGuard allowedRoles={[Role.ADMIN, Role.TEAM_MANAGER]}>
                      <TeamReports />
                    </RoleGuard>
                  }
                />

                {/* Team Lead Role Routes */}
                <Route
                  path="/team-lead"
                  element={
                    <RoleGuard allowedRoles={[Role.ADMIN, Role.TEAM_LEAD]}>
                      <TeamLeadDashboard />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/team-lead/productivity"
                  element={
                    <RoleGuard allowedRoles={[Role.ADMIN, Role.TEAM_LEAD]}>
                      <Productivity />
                    </RoleGuard>
                  }
                />

                {/* Employee Self-Service Routes */}
                <Route
                  path="/employee"
                  element={
                    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR, Role.TEAM_MANAGER, Role.TEAM_LEAD, Role.EMPLOYEE]}>
                      <EmployeeDashboard />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/employee/profile"
                  element={
                    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR, Role.TEAM_MANAGER, Role.TEAM_LEAD, Role.EMPLOYEE]}>
                      <Profile />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/employee/attendance"
                  element={
                    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR, Role.TEAM_MANAGER, Role.TEAM_LEAD, Role.EMPLOYEE]}>
                      <MyAttendance />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/employee/performance"
                  element={
                    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR, Role.TEAM_MANAGER, Role.TEAM_LEAD, Role.EMPLOYEE]}>
                      <MyPerformance />
                    </RoleGuard>
                  }
                />

                {/* Root & Default Route Fallback */}
                <Route path="/" element={<Navigate to="/admin" replace />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
