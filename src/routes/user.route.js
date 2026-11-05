import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { verifyToken, authorize } from '../middlewares/auth.middleware.js';
import { ROLES } from '../models/user.model.js';

const router = express.Router();

// Mọi route bên dưới đều cần Bearer Token
router.use(verifyToken);

// Thông tin user đang đăng nhập (USER / ADMIN đều được)
router.get('/me', userController.getMe);

// (Protected) Lấy danh sách user - chỉ ADMIN
router.get('/', authorize(ROLES.ADMIN), userController.getUsers);

export default router;
