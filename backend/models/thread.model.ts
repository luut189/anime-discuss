import mongoose, { Schema, Document } from 'mongoose';

interface IThread extends Document {
    mal_id: number;
    title: string;
    author: string;
    authorId?: string;
    content: string;
    commentCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const ThreadSchema = new Schema<IThread>(
    {
        mal_id: {
            type: Number,
            required: true,
        },
        author: {
            type: String,
            default: 'Anonymous',
        },
        authorId: {
            type: String,
            required: false,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        commentCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
);

const Thread = mongoose.model<IThread>('Thread', ThreadSchema);

export default Thread;
export { IThread };
