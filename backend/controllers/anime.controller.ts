import { WEEKDAYS } from '@/common/constants';
import logger from '@/common/logger';
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
        logger.error(error);
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
        logger.error(error);
    }
}

export { getAnimeByDay, getTodayAnime };
