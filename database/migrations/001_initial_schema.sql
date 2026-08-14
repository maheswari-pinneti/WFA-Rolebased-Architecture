CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  status TEXT DEFAULT 'ACTIVE',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  role TEXT NOT NULL,
  department TEXT,
  team TEXT,
  location TEXT,
  title TEXT,
  clearanceLevel INTEGER DEFAULT 1,
  status TEXT DEFAULT 'ACTIVE',
  permissions TEXT DEFAULT '[]',
  mfa_enabled INTEGER DEFAULT 1,
  organizationId TEXT DEFAULT 'org-stackly',
  FOREIGN KEY (organizationId) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  clearanceLevel INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS permissions (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT
);

CREATE TABLE IF NOT EXISTS role_permissions (
  roleId TEXT,
  permissionId TEXT,
  PRIMARY KEY (roleId, permissionId),
  FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permissionId) REFERENCES permissions(id) ON DELETE CASCADE
);

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
  location TEXT,
  organizationId TEXT DEFAULT 'org-stackly',
  FOREIGN KEY (organizationId) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  managerId TEXT,
  organizationId TEXT DEFAULT 'org-stackly',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organizationId) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  departmentId TEXT,
  leadId TEXT,
  organizationId TEXT DEFAULT 'org-stackly',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (departmentId) REFERENCES departments(id),
  FOREIGN KEY (organizationId) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS shifts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  startTime TEXT,
  endTime TEXT,
  gracePeriodMinutes INTEGER DEFAULT 0,
  organizationId TEXT DEFAULT 'org-stackly',
  FOREIGN KEY (organizationId) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  employeeId TEXT NOT NULL,
  skillName TEXT NOT NULL,
  level INTEGER,
  isTopSkill INTEGER DEFAULT 0,
  isMissingSkill INTEGER DEFAULT 0,
  department TEXT,
  team TEXT,
  organizationId TEXT DEFAULT 'org-stackly',
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (organizationId) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS performance_records (
  id TEXT PRIMARY KEY,
  employeeId TEXT NOT NULL,
  quarter TEXT,
  kpiScore REAL,
  targetScore REAL,
  productivityScore REAL,
  department TEXT,
  team TEXT,
  organizationId TEXT DEFAULT 'org-stackly',
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (organizationId) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  assigneeId TEXT,
  assigneeName TEXT,
  department TEXT,
  team TEXT,
  organizationId TEXT DEFAULT 'org-stackly',
  priority TEXT,
  status TEXT,
  points INTEGER DEFAULT 0,
  updatedAt TEXT,
  FOREIGN KEY (assigneeId) REFERENCES employees(id) ON DELETE SET NULL,
  FOREIGN KEY (organizationId) REFERENCES organizations(id)
);
