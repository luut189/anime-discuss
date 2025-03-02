import { AuthRequest } from '@/middleware/protect.route';
import Thread from '@/models/thread.model';
import User from '@/models/user.model';
import { Response } from 'express';

async function getThreads(req: AuthRequest, res: Response) {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const threads = await Thread.find({ authorId: user.id });
        res.status(200).json(threads);
    } catch (error) {
        console.error('Error fetching threads:', error);
        res.status(500).json({ error: 'Failed to fetch threads' });
    }
}

async function getPinnedAnime(req: AuthRequest, res: Response) {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const data = await User.findById(user.id).select('pinnedAnime');
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching pinned anime:', error);
        res.status(500).json({ error: 'Failed to fetch pinned anime' });
    }
}

async function addPinnedAnime(req: AuthRequest, res: Response) {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { mal_id } = req.body;
        if (!mal_id) {
            res.status(400).json({ error: 'Anime ID is required' });
            return;
        }

        const updatedUser = await User.findByIdAndUpdate(
            user.id,
            { $addToSet: { pinnedAnime: mal_id } },
            { new: true, select: 'pinnedAnime' },
        );

        if (!updatedUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json(updatedUser.pinnedAnime);
    } catch (error) {
        console.error('Error adding pinned anime:', error);
        res.status(500).json({ error: 'Failed to pin anime' });
    }
}

async function removePinnedAnime(req: AuthRequest, res: Response) {
    try {
        const user = req.user;
        const { mal_id } = req.body;

        if (!user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!mal_id) {
            res.status(400).json({ error: 'Anime ID is required' });
            return;
        }

        const updatedUser = await User.findByIdAndUpdate(
            user.id,
            { $pull: { pinnedAnime: mal_id } },
            { new: true, select: 'pinnedAnime' },
        );

        if (!updatedUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json(updatedUser.pinnedAnime);
    } catch (error) {
        console.error('Error removing pinned anime:', error);
        res.status(500).json({ error: 'Failed to unpin anime' });
    }
}

export { getThreads, getPinnedAnime, addPinnedAnime, removePinnedAnime };
