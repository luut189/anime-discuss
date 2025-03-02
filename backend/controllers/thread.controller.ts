import Thread, { IThread } from '@/models/thread.model';
import Comment from '@/models/comment.model';
import { Request, Response } from 'express';
import User from '@/models/user.model';
import { AuthRequest } from '@/middleware/protect.route';

async function createThread(req: AuthRequest, res: Response) {
    try {
        const { mal_id, title, content } = req.body;
        const user = req.user;

        if (!mal_id || !title || !content) {
            res.status(400).json({ success: false, message: 'All fields are required' });
            return;
        }

        const threadData: Partial<IThread> = {
            mal_id,
            title,
            content,
            author: user ? user.username : 'Anonymous',
            authorId: user ? user.id : undefined,
        };

        const newThread = await Thread.create(threadData);

        if (user) {
            await User.findByIdAndUpdate(user.id, { $push: { threads: newThread._id } });
        }

        res.status(201).json(newThread);
    } catch (error) {
        console.error('Error creating thread:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create thread',
        });
    }
}

async function getThreads(req: Request, res: Response) {
    try {
        const { mal_id } = req.params;

        const threads = await Thread.find({ mal_id }).sort({ createdAt: -1 }).populate({
            path: 'comments',
        });
        res.json(threads);
    } catch (error) {
        res.status(500).json({
            error: `Failed to fetch threads: ${error}`,
        });
    }
}

async function getThread(req: Request, res: Response) {
    try {
        const thread = await Thread.findById(req.params.id).populate({
            path: 'comments',
        });

        res.json(thread);
    } catch (error) {
        res.status(500).json({
            error: `Failed to fetch thread: ${error}`,
        });
    }
}

async function deleteThread(req: AuthRequest, res: Response) {
    try {
        const { id } = req.params;
        const user = req.user;
        const thread = await Thread.findById(id);

        if (!thread) {
            res.status(404).json({ error: 'Thread not found' });
            return;
        }

        if (thread.authorId) {
            if (!user || thread.authorId.toString() !== user.id) {
                res.status(403).json({ error: 'Unauthorized to delete this thread' });
                return;
            }

            await User.findByIdAndUpdate(user.id, { $pull: { threads: id } });
        } else {
            if (user) {
                res.status(403).json({ error: 'Logged-in users cannot delete anonymous threads' });
                return;
            }
        }
        await Comment.deleteMany({ thread: id });
        await thread.deleteOne();

        res.json({ message: 'Thread deleted successfully' });
    } catch (error) {
        console.error('Error deleting thread:', error);
        res.status(500).json({ error: 'Failed to delete thread' });
    }
}

async function createComment(req: Request, res: Response) {
    try {
        const { threadId, author, content } = req.body;

        if (!threadId || !author || !content) {
            res.status(400).json({ success: false, message: 'All fields are required' });
            return;
        }

        const newComment = await Comment.create({
            thread: threadId,
            author,
            content,
        });

        await Thread.findByIdAndUpdate(threadId, { $push: { comments: newComment._id } });

        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({
            error: `Failed to create comment: ${error}`,
        });
    }
}

export { createThread, getThreads, getThread, deleteThread, createComment };
