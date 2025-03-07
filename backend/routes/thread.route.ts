import {
    createThread,
    getAllThreads,
    getThreads,
    getThread,
    createComment,
    deleteThread,
} from '@/controllers/thread.controller';
import { protectRoute } from '@/middleware/protect.route';
import { Router } from 'express';

const router = Router();
const commentRouter = Router();

router.post('/public', createThread);
router.post('/auth', protectRoute, createThread);

router.get('/', getAllThreads);
router.get('/:mal_id', getThreads);
router.get('/:id', getThread);

router.delete('/public/:id', deleteThread);
router.delete('/auth/:id', protectRoute, deleteThread);

commentRouter.post('/', createComment);

router.use('/comment', commentRouter);

export default router;
