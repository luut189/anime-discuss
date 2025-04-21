import {
    addPinnedAnime,
    getPinnedAnime,
    getUserThreads,
    removePinnedAnime,
} from '@/controllers/user.controller';
import { protectRoute } from '@/middleware/protect.route';
import { Router } from 'express';

const router = Router();

router.get('/threads', protectRoute, getUserThreads);
router.get('/pinnedAnime', protectRoute, getPinnedAnime);
router.post('/pinnedAnime', protectRoute, addPinnedAnime);
router.delete('/pinnedAnime', protectRoute, removePinnedAnime);

export default router;
