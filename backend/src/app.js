import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.routes.js';
import { initDb } from './config/db.js';

const app = express();

app.use(cors());
app.use(express.json());

// Register API v1 Router
app.use('/v1', apiRouter);

// Database initialization
initDb().then(() => {
  console.log("Database initialized successfully.");
});

app.use((err, req, res, next) => {
  console.error("UNCAUGHT EXCEPTION:", err);
  res.status(500).json({ success: false, message: err.message });
});

export { app };
