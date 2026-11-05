import bcrypt from 'bcrypt';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

// hash password
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

// so sánh password
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
