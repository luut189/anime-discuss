import { getCommentsByThreadId, getThreadById } from '@/api/thread';
import { Comment, CommentSkeleton, Thread, ThreadSkeleton } from '@/components/thread/Thread';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

export default function ThreadPage() {
    const { id } = useParams();
    const { data: threadData, isPending: isThreadPending } = useQuery({
        queryKey: [`thread-${id}`],
        queryFn: () => getThreadById(id as string),
        enabled: !!id,
        retry: 5,
    });

    const { data: commentData, isPending: isCommentPending } = useQuery({
        queryKey: [`comments-${id}`],
        queryFn: () => getCommentsByThreadId(id as string),
        enabled: !!id,
        retry: 5,
    });

    if (isThreadPending || isCommentPending) {
        return (
            <>
                <ThreadSkeleton />
                <div className='flex flex-col gap-4'>
                    <h1 className='mt-2 text-2xl font-semibold'>Comments</h1>
                    {Array.from({ length: Math.random() * 5 + 1 }).map((_, idx) => (
                        <CommentSkeleton key={idx} />
                    ))}
                </div>
            </>
        );
    }

    if (!threadData) {
        return (
            <div className='flex items-center justify-center rounded-lg border p-4'>
                There is nothing here...
            </div>
        );
    }

    return (
        <>
            <Thread key={threadData._id} {...threadData} />
            <div className='flex flex-col gap-4'>
                <h1 className='mt-2 text-2xl font-semibold'>Comments</h1>
                {commentData && commentData.length > 0 ? (
                    commentData.map((comment) => (
                        <Comment key={comment._id} {...comment} depth={0} />
                    ))
                ) : (
                    <>
                        <p>There is no comment. Wanna make some noise?</p>
                    </>
                )}
            </div>
        </>
    );
}
