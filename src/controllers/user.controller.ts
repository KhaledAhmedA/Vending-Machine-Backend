import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/auth.middleware';

// GET all users (for admin/debug)
export const getAllUsers = async (_req: Request, res: Response) => {
    const users = await User.find().select('-password');
    res.json(users);
};

// GET current user (authenticated)
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user!.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
};

// // PUT update current user
// export const updateUser = async (req: AuthRequest, res: Response) => {
//     const { password } = req.body;

//     const update: any = {};
//     if (password) update.password = await bcrypt.hash(password, 10);

//     const user = await User.findByIdAndUpdate(req.user!.id, update, {
//         new: true,
//     }).select('-password');

//     res.json(user);
// };



// PUT /account/me
export const updateUser = async (req: AuthRequest, res: Response) => {
    const { username, password, role } = req.body;

    const update: Partial<{ username: string; password: string; role: string }> = {};

    if (username) update.username = username;
    if (role) update.role = role;
    if (password) update.password = await bcrypt.hash(password, 10);

    try {
        const user = await User.findByIdAndUpdate(
            req.user!.id,
            update,
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        console.error('Update user error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE current user
export const deleteUser = async (req: AuthRequest, res: Response) => {
    await User.findByIdAndDelete(req.user!.id);
    res.json({ message: 'User deleted successfully' });
};
