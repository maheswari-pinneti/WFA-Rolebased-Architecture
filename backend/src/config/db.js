import mongoose from 'mongoose';
import { connectMongoDB } from './mongodb.js';
import { seedMongo } from '../../scripts/seed-mongodb.js';
import { AuditLog } from '../models/AuditLog.js';

const ORGANIZATION_ID = 'org-stackly';

const validateDatabaseStartup = async () => {
  console.log("[DB Validation] Starting database verification...");
  
  // Verify database connectivity using MongoDB ping
  if (!mongoose.connection || mongoose.connection.readyState !== 1) {
    throw new Error("MongoDB connection is not active.");
  }
  
  await mongoose.connection.db.admin().ping();
  console.log("[DB Validation] MongoDB ping verification passed successfully.");
  
  // Verify read/write capability on audit log
  const testId = 'startup-verify-' + Date.now();
  await AuditLog.create({
    id: testId,
    timestamp: new Date().toISOString(),
    employeeId: 'system',
    action: 'startup-test',
    details: 'validation-write',
    organizationId: ORGANIZATION_ID
  });

  const verifyWrite = await AuditLog.findOne({ id: testId });
  if (!verifyWrite) {
    throw new Error("Database write verification failed: could not retrieve written row.");
  }
  
  await AuditLog.deleteOne({ id: testId });
  console.log("[DB Validation] Database read/write verified successfully.");
};

let initPromise;
export const initDb = () => {
  if (!initPromise) {
    initPromise = (async () => {
      try {
        // Connect to MongoDB Atlas
        await connectMongoDB();
        // Seed default dataset non-destructively
        await seedMongo();
        // Validate database setup
        await validateDatabaseStartup();
        return true;
      } catch (err) {
        console.error("Database initialization failed:", err);
        throw err;
      }
    })();
  }
  return initPromise;
};

export const logAudit = (userId, action, details, organizationId = ORGANIZATION_ID) => {
  const id = Math.random().toString(36).slice(2, 11);
  const timestamp = new Date().toISOString();
  
  AuditLog.create({
    id,
    timestamp,
    employeeId: userId || 'anonymous',
    action,
    details,
    organizationId
  }).catch((err) => {
    console.error('Failed to write audit log:', err.message);
  });
};

export { ORGANIZATION_ID };
export default {};
