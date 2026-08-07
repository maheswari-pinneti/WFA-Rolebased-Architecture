import express from 'express';
import {
  getRecords,
  checkIn,
  takeBreak,
  resumeWork,
  checkOut,
  getCorrections,
  submitCorrection,
  updateCorrectionStatus
} from '../controllers/attendanceController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/records', authenticateToken, getRecords);
router.post('/check-in', authenticateToken, checkIn);
router.post('/break', authenticateToken, takeBreak);
router.post('/resume', authenticateToken, resumeWork);
router.post('/check-out', authenticateToken, checkOut);

router.get('/corrections', authenticateToken, getCorrections);
router.post('/corrections', authenticateToken, submitCorrection);
router.put('/corrections/:id', authenticateToken, updateCorrectionStatus);

export default router;
