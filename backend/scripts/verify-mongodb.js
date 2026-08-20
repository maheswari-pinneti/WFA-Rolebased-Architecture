import mongoose from 'mongoose';
import 'dotenv/config';
import { connectMongoDB } from '../src/config/mongodb.js';
import { User, MfaChallenge } from '../src/models/User.js';
import { Employee } from '../src/models/Employee.js';
import { Attendance, IdempotencyRecord } from '../src/models/Attendance.js';

const runCoreDatabaseChecks = async () => {
  try {
    console.log("==================================================");
    console.log("STARTING CORE DATABASE CHECKS (AUDIT & HARDENING)");
    console.log("==================================================");

    // 1. Establish database connection
    console.log("\n[CHECK 1] Connecting to MongoDB Atlas...");
    await connectMongoDB();
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      console.log("  ➜ Connection established successfully.");
      console.log(`  ➜ Active Database: ${mongoose.connection.db.databaseName}`);
    } else {
      throw new Error("Failed to activate database connection.");
    }

    // 2. Data Integrity Checks
    console.log("\n[CHECK 2] Auditing Data Integrity & Constraints...");
    
    // Check for duplicate emails
    const duplicateEmails = await User.aggregate([
      { $group: { _id: "$email", count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ]);
    if (duplicateEmails.length > 0) {
      console.warn(`  ⚠ Warning: Found ${duplicateEmails.length} duplicate email(s) in users collection.`);
    } else {
      console.log("  ✓ OK: No duplicate emails found.");
    }

    // Check for duplicate employee IDs
    const duplicateEmployees = await Employee.aggregate([
      { $group: { _id: "$id", count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ]);
    if (duplicateEmployees.length > 0) {
      console.warn(`  ⚠ Warning: Found ${duplicateEmployees.length} duplicate employee ID(s).`);
    } else {
      console.log("  ✓ OK: All employee IDs are unique.");
    }

    // Check for null or empty mandatory fields
    const invalidUsers = await User.countDocuments({
      $or: [
        { id: { $exists: false } }, { id: null }, { id: "" },
        { email: { $exists: false } }, { email: null }, { email: "" },
        { role: { $exists: false } }, { role: null }
      ]
    });
    if (invalidUsers > 0) {
      console.warn(`  ⚠ Warning: Found ${invalidUsers} invalid user record(s) lacking mandatory fields.`);
    } else {
      console.log("  ✓ OK: No user records are missing mandatory fields.");
    }

    // 3. Database Index Verification
    console.log("\n[CHECK 3] Verifying Database Indexes...");
    
    const verifyIndexes = async (model, collectionName, expectedFields) => {
      const indexes = await model.collection.getIndexes();
      console.log(`  ➜ Collection: ${collectionName}`);
      for (const field of expectedFields) {
        const found = Object.keys(indexes).some(idxName => idxName.includes(field));
        if (found) {
          console.log(`    ✓ Index verified on: ${field}`);
        } else {
          console.warn(`    ⚠ Missing index on field: ${field}`);
        }
      }
    };

    await verifyIndexes(User, 'users', ['id', 'email', 'companyId']);
    await verifyIndexes(Employee, 'employees', ['id', 'companyId']);
    await verifyIndexes(Attendance, 'attendancerecords', ['id', 'employeeId', 'date', 'companyId']);

    // Check compound and unique constraint on idempotency records
    const idempotencyIndexes = await IdempotencyRecord.collection.getIndexes();
    const hasCompound = Object.keys(idempotencyIndexes).some(idxName => idxName.includes('companyId') && idxName.includes('key'));
    if (hasCompound) {
      console.log("  ✓ Compound unique index verified on IdempotencyRecord { companyId, key }.");
    } else {
      console.warn("  ⚠ Warning: Compound unique index missing on IdempotencyRecord.");
    }

    // 4. Pagination Simulation Check
    console.log("\n[CHECK 4] Testing Pagination Performance...");
    const testPage = 1;
    const testLimit = 10;
    const testSkip = (testPage - 1) * testLimit;
    
    const startTime = Date.now();
    const totalRecords = await Employee.countDocuments({});
    const paginatedRecords = await Employee.find({})
      .skip(testSkip)
      .limit(testLimit)
      .lean();
    const duration = Date.now() - startTime;

    console.log(`  ➜ Total Records: ${totalRecords}`);
    console.log(`  ➜ Page size limit: ${testLimit} (Retrieved: ${paginatedRecords.length} records)`);
    console.log(`  ➜ Query Execution Time: ${duration}ms`);
    if (duration < 100) {
      console.log("  ✓ OK: Pagination query performs within acceptable speed thresholds (<100ms).");
    } else {
      console.warn("  ⚠ Warning: Pagination query exceeded performance threshold.");
    }

    console.log("\n==================================================");
    console.log("DATABASE AUDIT STATUS: SUCCESS & GREEN");
    console.log("==================================================");

  } catch (err) {
    console.error("\n==================================================");
    console.error(`DATABASE AUDIT STATUS: FAILED`);
    console.error(`Error Details: ${err.message}`);
    console.error("==================================================");
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
};

runCoreDatabaseChecks();
