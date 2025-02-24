import {
    createThread,
    getThreads,
    getThread,
    createComment,
    deleteThread,
} from '@/controllers/thread.controller';
import { Router } from 'express';

const router = Router();
const commentRouter = Router();

router.post('/', createThread);
router.get('/:mal_id', getThreads);
router.get('/:id', getThread);
router.delete('/:id', deleteThread);

commentRouter.post('/', createComment);

router.use('/comment', commentRouter);

export default router;
