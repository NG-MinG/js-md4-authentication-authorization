import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

export default router;
