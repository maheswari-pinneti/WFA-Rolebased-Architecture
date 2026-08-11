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
  email TEXT PRIMARY KEY,
  otp_hash TEXT,
  expires_at TEXT,
  attempts_count INTEGER DEFAULT 0,
  created_at TEXT,
  status TEXT
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
  FOREIGN KEY (employeeId) REFERENCES employees(id),
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
  FOREIGN KEY (employeeId) REFERENCES employees(id),
  FOREIGN KEY (organizationId) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS leave_requests (
  id TEXT PRIMARY KEY,
  employeeId TEXT NOT NULL,
  employeeName TEXT,
  department TEXT,
  team TEXT,
  organizationId TEXT DEFAULT 'org-stackly',
  type TEXT,
  startDate TEXT,
  endDate TEXT,
  reason TEXT,
  status TEXT DEFAULT 'PENDING',
  reviewedBy TEXT,
  reviewComment TEXT,
  createdAt TEXT,
  FOREIGN KEY (employeeId) REFERENCES employees(id),
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
  FOREIGN KEY (assigneeId) REFERENCES employees(id),
  FOREIGN KEY (organizationId) REFERENCES organizations(id)
);
