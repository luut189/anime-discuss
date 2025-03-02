import bcryptjs from 'bcryptjs';
import { Request, Response } from 'express';
import User from '@/models/user.model';
import { generateJWTAndSetCookie } from '@/common/utils';
import { AuthRequest } from '@/middleware/protect.route';
import { ENV } from '@/common/constants';

async function signup(req: Request, res: Response) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ success: false, message: 'All fields are required' });
            return;
        }

        const userExists = await User.findOne({ username });
        if (userExists) {
            res.status(400).json({ success: false, message: 'This username already exists' });
            return;
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const PROFILE_PICS = ['/avatar1.png', '/avatar2.png', '/avatar3.png'];
        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        const newUser = new User({
            username,
            password: hashedPassword,
            image,
        });

        await newUser.save();

        generateJWTAndSetCookie(newUser.id, res);

        res.status(201).json({
            success: true,
            user: { ...newUser.toObject(), password: undefined },
        });
    } catch (error) {
        console.error(`Error in signup controller: ${error}`);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function login(req: Request, res: Response) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ success: false, message: 'All fields are required' });
            return;
        }

        const user = await User.findOne({ username });
        if (!user) {
            res.status(404).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        generateJWTAndSetCookie(user.id, res);

        res.status(200).json({
            success: true,
            user: { ...user.toObject(), password: undefined },
        });
    } catch (error) {
        console.error(`Error in login controller: ${error}`);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function logout(req: Request, res: Response) {
    try {
        res.clearCookie('jwt-anime-discussion', {
            httpOnly: true,
            secure: ENV.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.status(200).json({ success: true, message: 'Signed out successfully' });
    } catch (error) {
        console.error(`Error in logout controller: ${error}`);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function authCheck(req: AuthRequest, res: Response) {
    try {
        res.status(200).json({ success: true, user: req.user });
    } catch (error) {
        console.error(`Error in authCheck controller: ${error}`);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export { signup, login, logout, authCheck };
