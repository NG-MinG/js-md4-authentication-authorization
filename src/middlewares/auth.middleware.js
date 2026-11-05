import jwt from 'jsonwebtoken';
import { verifyAccessToken } from '../utils/jwt.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';

// Chốt chặn 1 - Authentication: Verify token hợp lệ?
// Sai / thiếu / hết hạn => 401 Unauthorized
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Header chuẩn: "Authorization: Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new UnauthorizedError('Access token is missing'));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded; // { userId, role, iat, exp }
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return next(new UnauthorizedError('Access token has expired'));
        }
        return next(new UnauthorizedError('Invalid access token'));
    }
};

// Chốt chặn 2 - Authorization: Người dùng có quyền?
// Không đủ quyền => 403 Forbidden
// Dùng: authorize('ADMIN') hoặc authorize('ADMIN', 'USER')
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new UnauthorizedError());
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new ForbiddenError('You do not have permission to access this resource'));
        }
        next();
    };
};
