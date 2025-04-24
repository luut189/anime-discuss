import {
    createThread,
    getAllThreads,
    getThreads,
    getThread,
    createComment,
    deleteThread,
    getComments,
} from '@/controllers/thread.controller';
import { protectRoute } from '@/middleware/protect.route';
import { Router } from 'express';

const router = Router();

router.post('/public', createThread);
router.post('/auth', protectRoute, createThread);

router.get('/', getAllThreads);
router.get('/anime/:mal_id', getThreads);
router.get('/:id', getThread);

router.delete('/public/:id', deleteThread);
router.delete('/auth/:id', protectRoute, deleteThread);

const commentRouter = Router();
commentRouter.post('/', protectRoute, createComment);
commentRouter.get('/:id', getComments);
router.use('/comment', commentRouter);

export default router;
