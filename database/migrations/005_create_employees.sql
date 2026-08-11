CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  employeeCode TEXT UNIQUE,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT,
  department TEXT,
  designation TEXT,
  status TEXT,
  avatar TEXT,
  joinDate TEXT,
  performanceScore REAL,
  attendanceRate REAL,
  team TEXT,
  organizationId TEXT DEFAULT 'org-stackly',
  FOREIGN KEY (organizationId) REFERENCES organizations(id)
);
