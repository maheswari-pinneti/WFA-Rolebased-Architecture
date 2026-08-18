-- Enterprise PostgreSQL Schema Definition
-- Migration path from SQLite to PostgreSQL for high-traffic environments

CREATE TABLE IF NOT EXISTS organizations (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255),
  status VARCHAR(50) DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  department VARCHAR(100),
  team VARCHAR(100),
  location VARCHAR(100),
  title VARCHAR(100),
  clearance_level INTEGER DEFAULT 1,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  permissions JSONB DEFAULT '[]'::jsonb,
  mfa_enabled BOOLEAN DEFAULT TRUE,
  organization_id VARCHAR(50) REFERENCES organizations(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS employees (
  id VARCHAR(50) PRIMARY KEY,
  employee_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  role VARCHAR(50) DEFAULT 'EMPLOYEE',
  department VARCHAR(100),
  designation VARCHAR(100),
  status VARCHAR(50) DEFAULT 'ACTIVE',
  avatar VARCHAR(255),
  join_date DATE,
  performance_score REAL DEFAULT 90.0,
  attendance_rate REAL DEFAULT 95.0,
  team VARCHAR(100),
  location VARCHAR(100),
  organization_id VARCHAR(50) REFERENCES organizations(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS attendance_records (
  id VARCHAR(50) PRIMARY KEY,
  employee_id VARCHAR(50) REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in TIMESTAMP WITH TIME ZONE,
  check_out TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'NOT_STARTED',
  location VARCHAR(255),
  organization_id VARCHAR(50) REFERENCES organizations(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(50) PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  actor VARCHAR(50) NOT NULL,
  action VARCHAR(100) NOT NULL,
  details TEXT,
  organization_id VARCHAR(50) REFERENCES organizations(id) ON DELETE SET NULL
);

-- Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_pg_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_pg_employees_code ON employees(employee_code);
CREATE INDEX IF NOT EXISTS idx_pg_attendance_emp_date ON attendance_records(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_pg_audit_timestamp ON audit_logs(timestamp);
