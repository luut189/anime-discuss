import {
    addPinnedAnime,
    getPinnedAnime,
    getUserThreads,
    removePinnedAnime,
    updateWatchedEpisode,
    updateAvatar,
    removeAvatar,
    getUserProfile,
} from '@/controllers/user.controller';
import { protectRoute } from '@/middleware/protect.route';
import { Router } from 'express';
import multer from 'multer';

const router = Router();
const upload = multer();

router.get('/:id', getUserProfile);
router.get('/threads/:id', protectRoute, getUserThreads);
router.get('/pinnedAnime/:id', protectRoute, getPinnedAnime);

router.post('/pinnedAnime', protectRoute, addPinnedAnime);
router.delete('/pinnedAnime', protectRoute, removePinnedAnime);
router.patch('/pinnedAnime/:animeId', protectRoute, updateWatchedEpisode);

router.post('/avatar', upload.single('file'), protectRoute, updateAvatar);
router.delete('/avatar', protectRoute, removeAvatar);

export default router;
