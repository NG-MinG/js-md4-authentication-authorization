import { AppError, NotFoundError } from '../utils/errors.js';

export const notFound = (req, res, next) => {
    next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
    // Lỗi nghiệp vụ do mình chủ động throw
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    // Lỗi validate của Mongoose
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((e) => e.message).join(', ');
        return res.status(400).json({ message });
    }

    // Lỗi trùng unique key (vd: email)
    if (err.code === 11000) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    // JSON body sai cú pháp
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ message: 'Invalid JSON body' });
    }

    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
};
