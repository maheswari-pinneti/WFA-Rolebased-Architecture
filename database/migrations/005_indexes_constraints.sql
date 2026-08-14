CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  timestamp TEXT,
  employeeId TEXT,
  action TEXT,
  details TEXT,
  organizationId TEXT DEFAULT 'org-stackly',
  FOREIGN KEY (organizationId) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS mfa_challenges (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  otp_hash TEXT,
  expires_at TEXT,
  attempts_count INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 5,
  consumed_at TEXT,
  resend_count INTEGER DEFAULT 0,
  created_at TEXT,
  status TEXT,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_attendance_employee_date ON attendance_records(employeeId, date);
CREATE INDEX IF NOT EXISTS idx_skills_employeeId ON skills(employeeId);
CREATE INDEX IF NOT EXISTS idx_performance_employeeId ON performance_records(employeeId);
