CREATE TABLE IF NOT EXISTS attendance_records (
  id TEXT PRIMARY KEY,
  employeeId TEXT NOT NULL,
  employeeName TEXT,
  department TEXT,
  date TEXT,
  checkInTime TEXT,
  checkOutTime TEXT,
  breaks TEXT DEFAULT '[]',
  shiftType TEXT,
  workMode TEXT,
  status TEXT,
  latitude REAL,
  longitude REAL,
  accuracy REAL,
  idempotencyKey TEXT UNIQUE,
  team TEXT,
  organizationId TEXT DEFAULT 'org-stackly',
  FOREIGN KEY (employeeId) REFERENCES employees(id),
  FOREIGN KEY (organizationId) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS corrections (
  id TEXT PRIMARY KEY,
  employeeId TEXT NOT NULL,
  employeeName TEXT,
  department TEXT,
  date TEXT,
  requestedCheckIn TEXT,
  requestedCheckOut TEXT,
  reason TEXT,
  status TEXT,
  managerComment TEXT,
  reviewedBy TEXT,
  createdAt TEXT,
  team TEXT,
  organizationId TEXT DEFAULT 'org-stackly',
  FOREIGN KEY (employeeId) REFERENCES employees(id),
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
