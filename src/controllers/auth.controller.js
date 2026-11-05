import * as authService from '../services/auth.service.js';

// Controller: nhận body/params, gọi Service, trả JSON response.
// Lỗi được chuyển sang error middleware qua next(err).

export const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({
            message: 'Register successfully',
            data: user,
        });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { user, accessToken, refreshToken } = await authService.login(req.body);
        res.status(200).json({
            message: 'Login successfully',
            data: { user, accessToken, refreshToken },
        });
    } catch (err) {
        next(err);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const tokens = await authService.refreshToken(req.body.refreshToken);
        res.status(200).json({
            message: 'Refresh token successfully',
            data: tokens,
        });
    } catch (err) {
        next(err);
    }
};

export const logout = async (req, res, next) => {
    try {
        await authService.logout(req.body.refreshToken);
        res.status(200).json({ message: 'Logout successfully' });
    } catch (err) {
        next(err);
    }
};
