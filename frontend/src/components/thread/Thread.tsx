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
import { Skeleton } from '@/components/ui/skeleton';
import ReplyThread from '@/components/thread/ReplyThread';
import useAuthStore from '@/store/useAuthStore';
import { deleteThread } from '@/api/thread';
import { timeAgo } from '@/lib/utils';

import { useState } from 'react';
import { ArrowUpRight, MessageSquare, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';

export function Thread({
    _id,
    author,
    authorId,
    comments,
    content,
    title,
    mal_id,
    createdAt,
    updatedAt,
}: IThread) {
    const [isReply, setIsReply] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthStore();

    async function handleDelete() {
        try {
            await deleteThread(_id, !!user);
            toast.success('Thread deleted!');
            console.log('Thread deleted.');
        } catch (error) {
            toast.error('Error deleting thread.');
            console.error('Error deleting thread:', error);
        }
        queryClient.invalidateQueries({ queryKey: [`threads-${mal_id}`] });
        if (user) queryClient.invalidateQueries({ queryKey: ['threads', user.username] });
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
                    {(user && user._id === authorId) || (!authorId && !user) ? (
                        <Button variant='destructive' className='ml-auto' onClick={handleDelete}>
                            <X />
                            Delete Thread
                        </Button>
                    ) : null}
                </div>
            </CardHeader>
            <CardContent className='flex flex-col gap-2'>
                <p>{content}</p>
            </CardContent>
            <CardFooter className='flex flex-col gap-2'>
                <div className='flex w-full flex-col gap-2'>
                    {comments
                        ? comments.map((comment) => <Comment key={comment._id} {...comment} />)
                        : null}
                </div>
                {isReply && (
                    <ReplyThread
                        mal_id={mal_id}
                        threadId={_id}
                        onReplySubmit={() => setIsReply(false)}
                    />
                )}
                <div className='flex w-full justify-between'>
                    {location.pathname !== `/anime/${mal_id}` ? (
                        <Button
                            onClick={() => {
                                navigate(`/anime/${mal_id}`);
                            }}>
                            <ArrowUpRight />
                            Jump to anime page
                        </Button>
                    ) : null}
                    <ReplyButton isReply={isReply} setIsReply={setIsReply} />
                </div>
            </CardFooter>
        </Card>
    );
}

export function ThreadSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className=''>
                    <Skeleton className='h-7 w-1/3' />
                </div>
                <div className='flex flex-col gap-2'>
                    <Skeleton className='h-4 w-48' />
                    <Skeleton className='h-4 w-40' />
                </div>
            </CardHeader>

            <CardContent>
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-3/4' />
                    <Skeleton className='h-4 w-1/2' />
                </div>
            </CardContent>

            <CardFooter>
                <Skeleton className='h-10 w-20' />
            </CardFooter>
        </Card>
    );
}

function Comment({ author, content, createdAt }: IComment) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{author}</CardTitle>
                <CardDescription>Created {timeAgo(createdAt)}</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-2'>
                <p>{content}</p>
            </CardContent>
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
