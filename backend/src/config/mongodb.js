import mongoose from 'mongoose';
import 'dotenv/config';

let connectionPromise = null;

export const connectMongoDB = async () => {
  if (connectionPromise) {
    return connectionPromise;
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'workforce';

  if (!MONGODB_URI) {
    const errorMsg = "MONGODB_URI is not defined in environment variables. Application startup aborted.";
    console.error("\n[MongoDB Error]", errorMsg, "\n");
    process.exit(1);
  }

  console.log("Connecting to MongoDB Atlas...");
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB_NAME,
      maxPoolSize: 50,
      minPoolSize: 10,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 3000
    });
    console.log("MongoDB connected successfully");
    console.log(`Database: ${MONGODB_DB_NAME}`);
    connectionPromise = conn;
    return conn;
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    if (process.env.NODE_ENV === 'development') {
      console.log("\n[Development Fallback] Starting in-memory MongoDB Server...");
      try {
        const { MongoMemoryReplSet } = await import('mongodb-memory-server');
        const mongod = await MongoMemoryReplSet.create({
          replSet: { count: 1 },
          instance: { startupTimeout: 40000 }
        });
        const uri = mongod.getUri();
        console.log(`[Development Fallback] In-memory MongoDB Server started at: ${uri}`);
        const conn = await mongoose.connect(uri, {
          dbName: MONGODB_DB_NAME,
          maxPoolSize: 50,
          socketTimeoutMS: 45000,
        });
        console.log("MongoDB connected successfully (in-memory dev fallback)");
        connectionPromise = conn;
        return conn;
      } catch (innerErr) {
        console.error("Failed to start in-memory MongoDB fallback:", innerErr.message);
        process.exit(1);
      }
    } else {
      console.error("Application startup aborted.");
      process.exit(1);
    }
  }
};

export const disconnectMongoDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
  connectionPromise = null;
};
