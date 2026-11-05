# Session 7 – Authentication & Authorization với JWT

Express + MongoDB (Mongoose), tổ chức theo mô hình MVC.

## Cấu trúc dự án

```
server.js                     # Nạp .env, kết nối DB, chạy server
src/
├── app.js                    # Khởi tạo Express, gắn routes & error handler
├── config/db.js              # Kết nối MongoDB
├── routes/                   # Định nghĩa endpoint (Đón khách)
│   ├── index.js
│   ├── auth.route.js
│   └── user.route.js
├── controllers/              # Nhận Request, gọi Service, trả JSON Response
│   ├── auth.controller.js
│   └── user.controller.js
├── services/                 # Business logic (hash password, tạo token)
│   ├── auth.service.js
│   └── user.service.js
├── models/user.model.js      # Mongoose Schema
├── middlewares/              # Cổng bảo vệ
│   ├── auth.middleware.js    # verifyToken (401) + authorize role (403)
│   ├── rateLimit.middleware.js
│   └── error.middleware.js
└── utils/
    ├── jwt.js                # Sinh / verify Access & Refresh Token
    ├── password.js           # bcrypt hash / compare
    └── errors.js             # BadRequest, Unauthorized, Forbidden, NotFound
scripts/seed-admin.js         # Tạo tài khoản ADMIN để test phân quyền
requests.http                 # Bộ request mẫu (REST Client / Postman)
```

## Chạy dự án

```bash
npm install
cp .env.example .env      # đổi JWT secret thành chuỗi dài, ngẫu nhiên
npm run seed:admin        # tạo admin@example.com / admin123
npm run dev
```

Cần MongoDB chạy ở `MONGO_URI` (mặc định `mongodb://localhost:27017/be-std`).

## API

| Method | Endpoint                 | Mô tả                                            |
|--------|--------------------------|--------------------------------------------------|
| POST   | `/api/auth/register`     | Tạo tài khoản mới                                |
| POST   | `/api/auth/login`        | Xác thực, trả `accessToken` + `refreshToken` (rate limit 5 lần/15 phút) |
| POST   | `/api/auth/refresh-token`| Đổi `refreshToken` lấy cặp token mới             |
| POST   | `/api/auth/logout`       | Xóa `refreshToken` khỏi DB (hủy phiên)           |
| GET    | `/api/users/me`          | (Protected) Thông tin user đang đăng nhập        |
| GET    | `/api/users`             | (Protected, ADMIN) Danh sách user                |

Gửi token qua header: `Authorization: Bearer <accessToken>`

## Mã lỗi

- `401 Unauthorized` – thiếu token, token sai chữ ký hoặc hết hạn
- `403 Forbidden` – token hợp lệ nhưng role không đủ quyền
- `429 Too Many Requests` – vượt rate limit

## Ghi chú bảo mật

- Password được băm bằng bcrypt, `select: false` nên không bao giờ bị trả về.
- Payload JWT chỉ chứa `userId`, `role` (payload ai cũng decode được).
- Access Token ngắn hạn (15m), Refresh Token dài hạn (7d), dùng 2 secret khác nhau.
- Refresh token được lưu trong DB: mỗi lần refresh sẽ cấp cặp token mới (rotation),
  token cũ hoặc token đã logout không dùng lại được.
- Không nhận `role` từ body khi register để tránh tự nâng quyền ADMIN.
