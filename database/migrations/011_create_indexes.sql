CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_attendance_employee_date ON attendance_records(employeeId, date);
CREATE INDEX IF NOT EXISTS idx_skills_employeeId ON skills(employeeId);
CREATE INDEX IF NOT EXISTS idx_performance_employeeId ON performance_records(employeeId);
