import { login, logout, signup, authCheck } from '@/controllers/auth.controller';
import { protectRoute } from '@/middleware/protect.route';
import { Router } from 'express';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/check', protectRoute, authCheck);

export default router;
