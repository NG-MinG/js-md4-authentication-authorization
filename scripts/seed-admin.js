// Tạo tài khoản ADMIN để test phân quyền: npm run seed:admin
import 'dotenv/config';
import mongoose from 'mongoose';
import User, { ROLES } from '../src/models/user.model.js';
import { hashPassword } from '../src/utils/password.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

await mongoose.connect(process.env.MONGO_URI);

const exist = await User.findOne({ email: ADMIN_EMAIL });
if (exist) {
    exist.role = ROLES.ADMIN;
    await exist.save();
    console.log(`Updated ${ADMIN_EMAIL} to ADMIN`);
} else {
    await User.create({
        username: 'admin',
        email: ADMIN_EMAIL,
        password: await hashPassword(ADMIN_PASSWORD),
        role: ROLES.ADMIN,
    });
    console.log(`Created admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
}

await mongoose.disconnect();
