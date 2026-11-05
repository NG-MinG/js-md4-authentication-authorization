import * as userService from '../services/user.service.js';

// GET /api/users  (ADMIN)
export const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({ data: users });
    } catch (err) {
        next(err);
    }
};

// GET /api/users/me  (mọi user đã đăng nhập)
export const getMe = async (req, res, next) => {
    try {
        // req.user được gắn bởi auth middleware sau khi verify token
        const user = await userService.getUserById(req.user.userId);
        res.status(200).json({ data: user });
    } catch (err) {
        next(err);
    }
};
