CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT,
  read INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  organizationId TEXT DEFAULT 'org-stackly',
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (organizationId) REFERENCES organizations(id)
);
