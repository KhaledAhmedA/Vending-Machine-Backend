import { Router } from 'express';
// import {
//     getAllUsers,
//     getCurrentUser,
//     updateUser,
//     deleteUser
// } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { deleteUser, getAllUsers, getCurrentUser, updateUser } from '../controllers/user.controller';

const router = Router();

// router.get('/', authenticate, getAllUsers); // Optionally admin-only
router.get('/me', authenticate, getCurrentUser as any);
router.put('/me', authenticate, updateUser as any);
router.delete('/me', authenticate, deleteUser);

export default router;
