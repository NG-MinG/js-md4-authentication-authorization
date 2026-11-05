// Các class lỗi dùng chung, gắn sẵn HTTP status code
export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class BadRequestError extends AppError {
    constructor(message = 'Bad Request') {
        super(message, 400);
    }
}

// 401: Chưa xác thực / token sai / hết hạn
export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

// 403: Đã xác thực nhưng không đủ quyền
export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}
