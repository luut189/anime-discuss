import { IThread } from '@/common/interfaces';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button, IconButton } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import ReplyThread from '@/components/thread/ReplyThread';
import useAuthStore from '@/store/useAuthStore';
import { deleteThread } from '@/api/thread';
import { timeAgo } from '@/lib/utils';
import useSubmit from '@/hooks/useSubmit';

import { useState } from 'react';
import { Film, Loader, MessageSquare, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';
import Markdown from 'react-markdown';
import clsx from 'clsx';

export function ReplyText({ commentCount }: { commentCount: number }) {
    return (
        <>
            {commentCount
                ? commentCount > 1
                    ? `${commentCount} replies`
                    : `${commentCount} reply`
                : 'Reply'}
        </>
    );
}

export function Thread({
    _id,
    author,
    authorId,
    avatar,
    content,
    title,
    mal_id,
    commentCount,
    createdAt,
    updatedAt,
}: IThread) {
    const [isReply, setIsReply] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthStore();

    const { isSubmitting, onSubmit } = useSubmit(async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this thread?')) return;

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
    });

    const isAtThreadPage = location.pathname === `/thread/${_id}`;
    const isAtAnimePage = location.pathname === `/anime/${mal_id}`;

    return (
        <Card
            title={clsx(!isAtThreadPage && 'Go to thread page')}
            className={clsx(!isAtThreadPage && 'group cursor-pointer hover:bg-secondary')}
            onClick={() => navigate(clsx(!isAtThreadPage && `/thread/${_id}`))}>
            <CardHeader>
                <div className='flex'>
                    <div className='flex w-2/3 flex-col gap-2'>
                        <CardTitle className='mb-2'>{title}</CardTitle>
                        <CardTitle className='flex items-center justify-start gap-2'>
                            <Avatar>
                                <AvatarImage src={avatar} />
                                <AvatarFallback>
                                    {author.toUpperCase().substring(0, 1)}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                variant={'link'}
                                className={clsx('p-0 text-lg', !authorId && 'hover:no-underline')}
                                asChild={!!authorId}>
                                {authorId ? (
                                    <a
                                        href={`/profile/${authorId}`}
                                        onClick={(e) => e.stopPropagation()}>
                                        {author}
                                    </a>
                                ) : (
                                    <>{author}</>
                                )}
                            </Button>
                        </CardTitle>
                        <CardDescription>Created {timeAgo(createdAt)}</CardDescription>
                        <CardDescription>Last updated {timeAgo(updatedAt)}</CardDescription>
                    </div>
                    {(user && user._id === authorId) || (!authorId && !user) ? (
                        <IconButton
                            variant='destructive'
                            className='ml-auto'
                            onClick={onSubmit}
                            disabled={isSubmitting}
                            icon={<X />}>
                            {isSubmitting ? <Loader className='animate-spin' /> : 'Delete Thread'}
                        </IconButton>
                    ) : null}
                </div>
            </CardHeader>
            <CardContent className='flex flex-col gap-2'>
                <div className='mb-2'>
                    <Markdown>{content.replace(/\n/g, '  \n')}</Markdown>
                </div>
                <div className='flex items-center justify-between gap-2'>
                    {!isAtAnimePage ? (
                        <a href={`/anime/${mal_id}`} onClick={(e) => e.stopPropagation()}>
                            <IconButton icon={<Film />}>Jump to anime page</IconButton>
                        </a>
                    ) : null}
                    <ReplyButton
                        commentCount={commentCount}
                        id={_id}
                        isReply={isReply}
                        setIsReply={setIsReply}
                    />
                </div>
                {isReply && (
                    <ReplyThread
                        mal_id={mal_id}
                        threadId={_id}
                        onReplySubmit={() => setIsReply(false)}
                    />
                )}
            </CardContent>
        </Card>
    );
}

export function ThreadSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div>
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

interface ReplyButtonProps {
    id: string;
    commentCount: number;
    isReply: boolean;
    setIsReply: (_: boolean) => void;
}

export function ReplyButton({ id, commentCount, isReply, setIsReply }: ReplyButtonProps) {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <Button
            onClick={
                location.pathname !== `/thread/${id}`
                    ? () => navigate(`/thread/${id}`)
                    : () => setIsReply(!isReply)
            }
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
                    {location.pathname !== `/thread/${id}` ? (
                        <ReplyText commentCount={commentCount} />
                    ) : (
                        'Reply'
                    )}
                </>
            )}
        </Button>
    );
}
