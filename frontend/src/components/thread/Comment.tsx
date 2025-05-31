import { IComment } from '@/common/interfaces';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import ReplyThread from '@/components/thread/ReplyThread';
import { ReplyButton, ReplyText } from '@/components/thread/Thread';
import { timeAgo } from '@/lib/utils';

import { useState } from 'react';
import { ChevronUp, MessageSquare } from 'lucide-react';
import Markdown from 'react-markdown';
import clsx from 'clsx';

interface CommentProps extends IComment {
    depth: number;
}

export function Comment({
    _id,
    mal_id,
    thread,
    author,
    authorId,
    avatar,
    content,
    children,
    createdAt,
    depth,
}: CommentProps) {
    const [isReply, setIsReply] = useState(false);
    const [viewReply, setViewReply] = useState(false);

    function countChildren(children: IComment[]) {
        if (!children) return 0;

        let count = children.length;
        for (const child of children) {
            count += countChildren(child?.children);
        }

        return count;
    }

    const commentCount = countChildren(children);

    return (
        <Card
            className={clsx(
                depth > 0 &&
                    'ml-2 rounded-none border-0 border-l-2 py-1 pl-4 shadow-none dark:shadow-none',
            )}>
            <CardHeader>
                <CardTitle className='flex items-center justify-start gap-2 text-xl'>
                    <Avatar>
                        <AvatarImage src={avatar} />
                        <AvatarFallback>{author.toUpperCase().substring(0, 1)}</AvatarFallback>
                    </Avatar>
                    <Button
                        variant={'link'}
                        className={clsx('p-0 text-lg', authorId && 'hover:no-underline')}
                        asChild={!!authorId}>
                        {authorId ? <a href={`/profile/${authorId}`}>{author}</a> : <>{author}</>}
                    </Button>
                </CardTitle>
                <CardDescription>Created {timeAgo(createdAt)}</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-2'>
                <div className='mb-2'>
                    <Markdown>{content.replace(/\n/g, '  \n')}</Markdown>
                </div>
                <div className='mr-auto flex w-fit'>
                    <ReplyButton
                        commentCount={commentCount}
                        id={thread}
                        isReply={isReply}
                        setIsReply={setIsReply}
                    />
                    {commentCount ? (
                        <Button onClick={() => setViewReply(!viewReply)} variant={'ghost'}>
                            <MessageSquare />
                            <ReplyText commentCount={commentCount} />
                            <ChevronUp
                                className={`transition-transform ${viewReply ? 'rotate-0' : 'rotate-180'}`}
                            />
                        </Button>
                    ) : null}
                </div>
                {isReply && (
                    <ReplyThread
                        mal_id={mal_id}
                        threadId={thread}
                        parentCommentId={_id}
                        onReplySubmit={() => setIsReply(false)}
                    />
                )}
                {viewReply ? (
                    <div className='flex flex-col gap-4'>
                        {children.map((comment) => (
                            <Comment key={comment._id} {...comment} depth={depth + 1} />
                        ))}
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}

export function CommentSkeleton({ depth = 0 }: { depth?: number }) {
    return (
        <Card
            className={clsx(
                depth > 0 &&
                    'ml-2 rounded-none border-0 border-l-2 py-1 pl-4 shadow-none dark:shadow-none',
            )}>
            <CardHeader>
                <Skeleton className='mb-1 h-6 w-32' />
                <Skeleton className='h-4 w-24' />
            </CardHeader>
            <CardContent className='flex flex-col gap-2'>
                <div className='mb-3 space-y-2'>
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-3/4' />
                    <Skeleton className='h-4 w-1/2' />
                </div>
                <div className='flex gap-2'>
                    <Skeleton className='h-8 w-20' />
                    <Skeleton className='h-8 w-24' />
                </div>
            </CardContent>
        </Card>
    );
}
