import { getTodayAnime, getTrendingAnime } from '@/controllers/anime.controller';
import { Router } from 'express';

const router = Router();

router.get('/today', getTodayAnime);
router.get('/trending', getTrendingAnime);

export default router;
