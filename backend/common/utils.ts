import { ENV } from '@/common/constants';

import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateJWTAndSetCookie = (userId: string, res: Response) => {
    const token = jwt.sign({ id: userId }, ENV.JWT_SECRET, { expiresIn: '15d' });

    res.cookie('jwt-anime-discussion', token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        httpOnly: true, // prevent XSS and cross-site scripting attacks and make it inaccessible to JS
        sameSite: 'strict', // prevent CSRF and cross-site request forgery attacks
        secure: ENV.NODE_ENV !== 'development',
    });
};
