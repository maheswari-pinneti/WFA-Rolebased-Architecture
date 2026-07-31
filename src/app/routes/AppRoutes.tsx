import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../../security/guards/ProtectedRoute';
import { MainLayout } from '../../shared/layouts/MainLayout';
import { LoginForm } from '../../auth/components/LoginForm';

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
      {/* Public Auth Route */}
      <Route path="/login" element={<LoginForm />} />

      {/* Protected Routes enclosed in MainLayout */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/roles" element={<RoleManagement />} />
                <Route path="/admin/settings" element={<SystemSettings />} />

                {/* HR Routes */}
                <Route path="/hr" element={<HRDashboard />} />
                <Route path="/hr/employees" element={<EmployeeManagement />} />
                <Route path="/hr/attendance" element={<AttendanceManagement />} />
                <Route path="/hr/reports" element={<HRReports />} />

                {/* Team Manager Routes */}
                <Route path="/manager" element={<ManagerDashboard />} />
                <Route path="/manager/analytics" element={<TeamAnalytics />} />
                <Route path="/manager/reports" element={<TeamReports />} />

                {/* Team Lead Routes */}
                <Route path="/team-lead" element={<TeamLeadDashboard />} />
                <Route path="/team-lead/productivity" element={<Productivity />} />

                {/* Employee Routes */}
                <Route path="/employee" element={<EmployeeDashboard />} />
                <Route path="/employee/profile" element={<Profile />} />
                <Route path="/employee/attendance" element={<MyAttendance />} />
                <Route path="/employee/performance" element={<MyPerformance />} />

                {/* Default Fallback Redirect */}
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
