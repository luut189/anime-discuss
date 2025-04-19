import { WEEKDAYS } from '@/common/constants';
import { Request, Response } from 'express';
import { SeasonalAnime } from '@/models/anime.model';

async function getTodayAnime(req: Request, res: Response) {
    const date = new Date();
    const today = WEEKDAYS[date.getDay()];

    try {
        const data = await SeasonalAnime.find({ 'broadcast.day': new RegExp(`${today}`, 'i') });
        if (data) {
            res.status(200).json(data);
        }
    } catch (error) {
        res.status(400).json(error);
        console.error(error);
    }
}

export { getTodayAnime };
