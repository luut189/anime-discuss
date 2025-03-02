import {
    addPinnedAnime,
    getPinnedAnime,
    getThreads,
    removePinnedAnime,
} from '@/controllers/user.controller';
import { protectRoute } from '@/middleware/protect.route';
import { Router } from 'express';

const router = Router();

router.get('/threads', protectRoute, getThreads);
router.get('/pinnedAnime', protectRoute, getPinnedAnime);
router.post('/pinnedAnime', protectRoute, addPinnedAnime);
router.delete('/pinnedAnime', protectRoute, removePinnedAnime);

export default router;
