import { WEEKDAYS } from '@/common/constants';
import { SeasonalAnime } from '@/models/anime.model';
import { Request, Response } from 'express';

async function getAnimeByDay(req: Request, res: Response) {
    const { day } = req.query;

    try {
        const data = await SeasonalAnime.find({ 'broadcast.day': new RegExp(`${day}`, 'i') });

        if (data) {
            res.status(200).json(data);
        }
    } catch (error) {
        res.status(400).json(error);
        console.error(error);
    }
}

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

export { getAnimeByDay, getTodayAnime };
