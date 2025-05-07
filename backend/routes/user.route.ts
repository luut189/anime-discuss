import {
    addPinnedAnime,
    getPinnedAnime,
    getUserThreads,
    removePinnedAnime,
    updateWatchedEpisode,
    updateAvatar,
    removeAvatar,
} from '@/controllers/user.controller';
import { protectRoute } from '@/middleware/protect.route';
import { Router } from 'express';
import multer from 'multer';

const router = Router();
const upload = multer();

router.get('/threads', protectRoute, getUserThreads);
router.get('/pinnedAnime', protectRoute, getPinnedAnime);
router.post('/pinnedAnime', protectRoute, addPinnedAnime);
router.delete('/pinnedAnime', protectRoute, removePinnedAnime);
router.patch('/pinnedAnime/:animeId', protectRoute, updateWatchedEpisode);

router.post('/avatar', upload.single('file'), protectRoute, updateAvatar);
router.delete('/avatar', protectRoute, removeAvatar);

export default router;
