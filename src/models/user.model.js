import mongoose from 'mongoose';

export const ROLES = {
    USER: 'USER',
    ADMIN: 'ADMIN',
};

const userSchema = new mongoose.Schema(
    {
        // Tên hiển thị, bắt buộc
        username: {
            type: String,
            required: [true, 'Username is required'],
            trim: true,
        },
        // Định danh đăng nhập, duy nhất
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        // Đã được băm (hashed). Tuyệt đối không lưu plain text.
        // select: false => mặc định không trả password khi query
        password: {
            type: String,
            required: [true, 'Password is required'],
            select: false,
        },
        // Phân quyền: USER | ADMIN, mặc định USER
        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.USER,
        },
        // Lưu refresh token hiện tại để quản lý phiên & logout
        refreshToken: {
            type: String,
            default: null,
            select: false,
        },
    },
    { timestamps: true }
);

// Không bao giờ trả password / refreshToken ra JSON
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
    },
});

const User = mongoose.model('User', userSchema);

export default User;
