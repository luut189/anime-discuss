import Thread, { IThread } from '@/models/thread.model';
import Comment, { IComment } from '@/models/comment.model';
import { Request, Response } from 'express';
import User from '@/models/user.model';
import { AuthRequest } from '@/middleware/protect.route';
import mongoose from 'mongoose';

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

async function getAllThreads(req: Request, res: Response) {
    try {
        const threads = await Thread.find().sort({ createdAt: -1 });
        res.status(201).json(threads);
    } catch (error) {
        console.error('Error getting all threads', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get all threads',
        });
    }
}

async function getThreadsByMalId(req: Request, res: Response) {
    try {
        const { mal_id } = req.params;

        const threads = await Thread.find({ mal_id }).sort({ createdAt: -1 });
        res.json(threads);
    } catch (error) {
        res.status(500).json({
            error: `Failed to fetch threads: ${error}`,
        });
    }
}

async function getThread(req: Request, res: Response) {
    try {
        const thread = await Thread.findById(req.params.id);

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

async function createComment(req: AuthRequest, res: Response) {
    try {
        const { threadId, content, parentCommentId } = req.body;
        const user = req.user;

        if (!threadId || !content) {
            res.status(400).json({ success: false, message: 'Thread ID and content are required' });
            return;
        }

        let path: mongoose.Types.ObjectId[] = [];

        if (parentCommentId) {
            const parent = await Comment.findById(parentCommentId);
            if (!parent) {
                res.status(404).json({ success: false, message: 'Parent comment not found' });
                return;
            }
            path = [...parent.path, parent._id as mongoose.Types.ObjectId];
        }

        await Thread.findByIdAndUpdate(threadId, { $inc: { commentCount: 1 } });

        const newComment = await Comment.create({
            thread: threadId,
            content,
            author: user ? user.username : 'Anonymous',
            parentComment: parentCommentId || null,
            path,
        });

        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Failed to create comment' });
    }
}

interface NestedComment extends Omit<IComment, ''> {
    children: NestedComment[];
}

async function getComments(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const comments = await Comment.find({ thread: id }).lean().sort({ path: 1, updatedAt: 1 });

        const commentMap = new Map<string, NestedComment>();
        const rootComments: NestedComment[] = [];

        for (const comment of comments) {
            const withChildren: NestedComment = { ...comment, children: [] };
            commentMap.set(comment._id.toString(), withChildren);
        }

        for (const comment of comments) {
            const current = commentMap.get(comment._id.toString())!;
            if (comment.parentComment) {
                const parent = commentMap.get(comment.parentComment.toString());
                parent?.children.push(current);
            } else {
                rootComments.push(current);
            }
        }

        res.status(200).json(rootComments);
    } catch (error) {
        console.error('Failed to fetch comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
}

export {
    createThread,
    getAllThreads,
    getThreadsByMalId,
    getThread,
    deleteThread,
    createComment,
    getComments,
};
