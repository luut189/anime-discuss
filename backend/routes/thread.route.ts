import {
    createThread,
    getThreads,
    getThread,
    createComment,
} from '@/controllers/thread.controller';
import { Router } from 'express';

const router = Router();
const commentRouter = Router();

router.post('/', createThread);
router.get('/', getThreads);
router.get('/:id', getThread);

commentRouter.post('/', createComment);

router.use('/comment', commentRouter);

export default router;
