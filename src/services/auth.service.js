import User from '../models/user.model.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '../utils/jwt.js';
import { BadRequestError, UnauthorizedError } from '../utils/errors.js';

// Tạo cặp token và lưu refresh token vào DB
const issueTokens = async (user) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
};

// POST /api/auth/register
export const register = async (dto) => {
    const { username, email, password } = dto;

    if (!username || !email || !password) {
        throw new BadRequestError('username, email and password are required');
    }
    if (password.length < 6) {
        throw new BadRequestError('Password must be at least 6 characters');
    }

    const exist = await User.findOne({ email });
    if (exist) throw new BadRequestError('Email already exists');

    const hashed = await hashPassword(password);

    // Lưu ý: không nhận "role" từ client để tránh tự nâng quyền ADMIN
    const user = await User.create({
        username,
        email,
        password: hashed,
    });
    return user;
};

// POST /api/auth/login
export const login = async (dto) => {
    const { email, password } = dto;

    if (!email || !password) {
        throw new BadRequestError('email and password are required');
    }

    // password có select: false nên phải lấy tường minh
    const user = await User.findOne({ email }).select('+password');

    // Dùng chung 1 thông báo để không lộ email nào đã tồn tại
    if (!user) throw new UnauthorizedError('Invalid email or password');

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new UnauthorizedError('Invalid email or password');

    const tokens = await issueTokens(user);
    return { user, ...tokens };
};

// POST /api/auth/refresh-token
export const refreshToken = async (token) => {
    if (!token) throw new BadRequestError('refreshToken is required');

    let decoded;
    try {
        decoded = verifyRefreshToken(token);
    } catch {
        throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Kiểm tra tính hợp lệ với DB: token phải trùng token đang lưu
    // => Token đã logout / đã bị thay thế sẽ không dùng được nữa
    const user = await User.findById(decoded.userId).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
        throw new UnauthorizedError('Refresh token has been revoked');
    }

    // Refresh token rotation: cấp lại cả cặp token mới
    return await issueTokens(user);
};

// POST /api/auth/logout
export const logout = async (token) => {
    if (!token) throw new BadRequestError('refreshToken is required');

    // Xóa refresh token khỏi DB => hủy phiên
    await User.updateOne({ refreshToken: token }, { $set: { refreshToken: null } });
};
