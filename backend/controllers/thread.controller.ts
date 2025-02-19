import Thread from '@/models/thread.model';
import Comment from '@/models/thread.model';
import { Request, Response } from 'express';

async function createThread(req: Request, res: Response) {
    try {
        const { mal_id, title, author, content } = req.body;

        const newThread = await Thread.create({ mal_id, title, author, content });
        res.status(201).json(newThread);
    } catch (error) {
        res.status(500).json({
            error: `Failed to create thread: ${error}`,
        });
    }
}

async function getThreads(req: Request, res: Response) {
    try {
        const { mal_id } = req.body;
        const threads = await Thread.findOne({ mal_id: mal_id }).populate('comments');
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
            populate: { path: 'replies' },
        });

        if (!thread) {
            res.status(404).json({ error: 'Thread not found' });
            return;
        }
        res.json(thread);
    } catch (error) {
        res.status(500).json({
            error: `Failed to fetch thread: ${error}`,
        });
    }
}

async function createComment(req: Request, res: Response) {
    try {
        const { threadId, author, content, parentCommentId } = req.body;

        const newComment = await Comment.create({
            thread: threadId,
            author,
            content,
            parentComment: parentCommentId || null,
        });

        if (parentCommentId) {
            await Comment.findByIdAndUpdate(parentCommentId, {
                $push: { replies: newComment._id },
            });
        } else {
            await Thread.findByIdAndUpdate(threadId, { $push: { comments: newComment._id } });
        }

        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({
            error: `Failed to create comment: ${error}`,
        });
    }
}

export { createThread, getThreads, getThread, createComment };
