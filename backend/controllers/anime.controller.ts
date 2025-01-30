import { getTodayAnimeData, getTrendingAnimeData } from '@/service/jikan';
import { Request, Response } from 'express';

export async function getTodayAnime(req: Request, res: Response) {
    try {
        const data = await getTodayAnimeData();
        if (data) {
            res.status(200).json({
                success: true,
                ...data,
            });
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error,
        });
        console.error(error);
    }
}

export async function getTrendingAnime(req: Request, res: Response) {
    try {
        const page = req.query.page as string;
        const data = await getTrendingAnimeData(page ? page : '1');
        if (data) {
            res.status(200).json({
                success: true,
                ...data,
            });
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error,
        });
        console.error(error);
    }
}
