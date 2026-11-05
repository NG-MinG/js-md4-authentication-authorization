// Nạp .env TRƯỚC mọi import khác.
// Lưu ý: với ES Module, các câu lệnh import được "hoist" lên đầu,
// nên dùng 'dotenv/config' thay vì gọi dotenv.config() sau import app
// để các module con đọc được process.env ngay khi được nạp.
import 'dotenv/config';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT || 3000;

const start = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
};

start();
