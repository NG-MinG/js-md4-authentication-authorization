import jwt from 'jsonwebtoken';

// Payload chỉ chứa thông tin cần thiết, TUYỆT ĐỐI không đưa password vào
// (payload chỉ được encode base64, ai cũng decode được)
const buildPayload = (user) => ({
    userId: user._id.toString(),
    role: user.role,
});

// Access Token: tuổi thọ ngắn (15m - 1h), gửi kèm mỗi request
export const generateAccessToken = (user) => {
    return jwt.sign(buildPayload(user), process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    });
};

// Refresh Token: tuổi thọ dài (7d - 30d), dùng để cấp lại Access Token
export const generateRefreshToken = (user) => {
    return jwt.sign(buildPayload(user), process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });
};

// verify sẽ throw lỗi nếu token sai chữ ký hoặc hết hạn (exp)
export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};
