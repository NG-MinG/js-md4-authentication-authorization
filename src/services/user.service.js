import User from '../models/user.model.js';
import { NotFoundError } from '../utils/errors.js';

export const getAllUsers = async () => {
    return await User.find().sort({ createdAt: -1 });
};

export const getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return user;
};
