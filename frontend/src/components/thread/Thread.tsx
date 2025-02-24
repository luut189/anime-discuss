import { IThread, IComment } from '@/common/interfaces';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReplyThread from '@/components/thread/ReplyThread';
import { timeAgo } from '@/lib/utils';

import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function Thread({
    _id,
    author,
    comments,
    content,
    title,
    mal_id,
    createdAt,
    updatedAt,
}: IThread) {
    const [isReply, setIsReply] = useState(false);
    const queryClient = useQueryClient();

    async function handleDelete() {
        try {
            const response = await fetch(`/api/thread/${_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to delete thread: ${response.statusText}`);
            }

            const deleted = await response.json();
            console.log('Thread deleted:', deleted);
        } catch (error) {
            console.error('Error deleting thread:', error);
        }
        queryClient.invalidateQueries({ queryKey: [`threads-${mal_id}`] });
    }

    return (
        <Card>
            <CardHeader>
                <div className='flex'>
                    <div className='flex flex-col gap-2'>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>
                            Created {timeAgo(createdAt)} by {author}
                        </CardDescription>
                        <CardDescription>Last updated {timeAgo(updatedAt)}</CardDescription>
                    </div>
                    <Button variant='destructive' className='ml-auto' onClick={handleDelete}>
                        <X />
                        Delete Thread
                    </Button>
                </div>
            </CardHeader>
            <CardContent className='flex flex-col gap-2'>
                <p>{content}</p>
            </CardContent>
            <CardFooter className='flex flex-col gap-2'>
                <div className='flex w-full flex-col gap-1'>
                    {comments.map((comment) => (
                        <Comment
                            key={comment._id}
                            _id={comment._id}
                            __v={comment.__v}
                            mal_id={mal_id}
                            thread={comment.thread}
                            author={comment.author}
                            content={comment.content}
                            replies={comment.replies}
                            createdAt={comment.createdAt}
                        />
                    ))}
                </div>
                {isReply && (
                    <ReplyThread
                        mal_id={mal_id}
                        threadId={_id}
                        onReplySubmit={() => setIsReply(false)}
                    />
                )}
                <ReplyButton isReply={isReply} setIsReply={setIsReply} />
            </CardFooter>
        </Card>
    );
}

function Comment({ _id, mal_id, author, content, createdAt, replies, thread }: IComment) {
    const [isReply, setIsReply] = useState(false);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{author}</CardTitle>
                <CardDescription>Created {timeAgo(createdAt)}</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-2'>
                <p>{content}</p>
            </CardContent>
            <CardFooter className='flex flex-col gap-2'>
                <div className='flex flex-col gap-1'>
                    {replies.map((reply) => (
                        <Comment
                            key={reply._id}
                            _id={reply._id}
                            __v={reply.__v}
                            mal_id={mal_id}
                            thread={reply.thread}
                            author={reply.author}
                            content={reply.content}
                            replies={reply.replies}
                            createdAt={reply.createdAt}
                            parentComment={reply.parentComment}
                        />
                    ))}
                </div>
                {isReply && (
                    <ReplyThread
                        mal_id={mal_id}
                        threadId={thread}
                        parentCommentId={_id}
                        onReplySubmit={() => setIsReply(false)}
                    />
                )}
                <ReplyButton isReply={isReply} setIsReply={setIsReply} />
            </CardFooter>
        </Card>
    );
}

interface ReplyButtonProps {
    isReply: boolean;
    setIsReply: (arg: boolean) => void;
}

function ReplyButton({ isReply, setIsReply }: ReplyButtonProps) {
    return (
        <Button
            onClick={() => setIsReply(!isReply)}
            className='ml-auto flex items-center justify-center'
            variant='ghost'>
            {isReply ? (
                <>
                    <X />
                    Close
                </>
            ) : (
                <>
                    <MessageSquare />
                    Reply
                </>
            )}
        </Button>
    );
}
