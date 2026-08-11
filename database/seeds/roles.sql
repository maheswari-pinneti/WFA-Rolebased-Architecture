INSERT OR IGNORE INTO roles (id, name, description, clearanceLevel) VALUES 
('role-admin', 'ADMIN', 'System Administrator with full access', 5),
('role-hr', 'HR', 'HR Professional managing employee data', 4),
('role-manager', 'MANAGER', 'Department Manager leading departments', 3),
('role-lead', 'TEAM_LEAD', 'Team Lead overseeing teams', 2),
('role-employee', 'EMPLOYEE', 'Regular employee with self-service access', 1);
