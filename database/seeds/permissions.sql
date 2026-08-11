INSERT OR IGNORE INTO permissions (id, name, description, category) VALUES 
('p-user-create', 'USER_CREATE', 'Can create users', 'User Management'),
('p-user-update', 'USER_UPDATE', 'Can update users', 'User Management'),
('p-user-delete', 'USER_DELETE', 'Can delete users', 'User Management'),
('p-employee-view-all', 'EMPLOYEE_VIEW_ALL', 'Can view all employee records', 'Employee Management'),
('p-attendance-view-all', 'ATTENDANCE_VIEW_ALL', 'Can view all attendance logs', 'Attendance'),
('p-report-view-all', 'REPORT_VIEW_ALL', 'Can view all company reports', 'Reports'),
('p-system-settings', 'SYSTEM_SETTINGS_MANAGE', 'Can manage global system settings', 'System');
