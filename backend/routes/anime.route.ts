import { getTodayAnime } from '@/controllers/anime.controller';
import { Router } from 'express';

const router = Router();

router.get('/today', getTodayAnime);

export default router;
