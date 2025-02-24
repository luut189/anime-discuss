import Thread from '@/models/thread.model';
import Comment from '@/models/comment.model';
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
        const { mal_id } = req.params;

        const threads = await Thread.find({ mal_id }).populate({
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

async function deleteThread(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await Comment.deleteMany({ thread: id });
        const thread = await Thread.findByIdAndDelete(id);

        res.json(thread);
    } catch (error) {
        res.status(500).json({
            error: `Failed to delete thread: ${error}`,
        });
    }
}

async function createComment(req: Request, res: Response) {
    try {
        const { threadId, author, content } = req.body;

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
