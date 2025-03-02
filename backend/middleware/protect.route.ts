import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '@/models/user.model';
import { ENV } from '@/common/constants';

export interface AuthRequest extends Request {
    user?: IUser;
}

export async function protectRoute(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const token = req.cookies['jwt-anime-discussion'];

        try {
            const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string };

            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                res.status(401).json({ success: false, message: 'User not found' });
                return;
            }

            req.user = user;
            next();
        } catch (jwtError) {
            res.status(401).json({
                success: false,
                message: 'JWT verification failed: ' + jwtError,
            });
        }
    } catch (error) {
        console.error('Unexpected error in auth middleware:', error);
        res.status(500).json({ success: false, message: 'Server error in authentication' });
    }
}
