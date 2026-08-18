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
      serverSelectionTimeoutMS: 5000
    });
    console.log("MongoDB connected successfully");
    console.log(`Database: ${MONGODB_DB_NAME}`);
    connectionPromise = conn;
    return conn;
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    console.error("Application startup aborted.");
    process.exit(1);
  }
};

export const disconnectMongoDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
  connectionPromise = null;
};
