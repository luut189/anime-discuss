import mongoose, { Schema, Document } from 'mongoose';

interface IComment extends Document {
    thread: mongoose.Types.ObjectId;
    author: string;
    authorId?: mongoose.Types.ObjectId;
    content: string;
    parentComment?: mongoose.Types.ObjectId | null;
    path: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
    {
        thread: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread',
            required: true,
        },
        author: {
            type: String,
            default: 'Anonymous',
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
            required: false,
        },
        content: {
            type: String,
            required: true,
        },
        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            default: null,
        },
        path: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Comment',
            default: [],
        },
    },
    { timestamps: true },
);

CommentSchema.index({ path: 1 });

const Comment = mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
export { IComment };
