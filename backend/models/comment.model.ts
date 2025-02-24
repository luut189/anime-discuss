import mongoose, { Schema, Document } from 'mongoose';

interface IComment extends Document {
    thread: mongoose.Types.ObjectId;
    author: string;
    content: string;
    parentComment?: mongoose.Types.ObjectId | null;
    replies: mongoose.Types.ObjectId[];
    createdAt: Date;
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
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

const Comment = mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
export { IComment };
