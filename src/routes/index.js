import express from 'express';
import authRoutes from './auth.route.js';
import userRoutes from './user.route.js';
import { apiLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

router.use(apiLimiter);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
