import express from 'express';
import { getUsers, updateUserRole, deleteUser } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getUsers);
router.put('/:id/role', authenticateToken, updateUserRole);
router.delete('/:id', authenticateToken, deleteUser);

export default router;
