import connectMongoDB from '@/config/db';
import Comment from '@/models/comment.model';
import Thread from '@/models/thread.model';
import mongoose from 'mongoose';

async function syncThreadsCommentCount() {
    await connectMongoDB();

    const threads = await Thread.find({});
    for (const thread of threads) {
        console.log(`Checking ${thread.id}`);
        const commentCount = await Comment.countDocuments({ thread: thread.id });
        console.log(`${thread.id} has ${commentCount} comments`);
        await Thread.findByIdAndUpdate(thread.id, { commentCount });
    }
    console.log('Finished');
}

syncThreadsCommentCount()
    .then(() => {
        mongoose.disconnect();
    })
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
