import { getAnimeByDay, getTodayAnime } from '@/controllers/anime.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getAnimeByDay);
router.get('/today', getTodayAnime);

export default router;
