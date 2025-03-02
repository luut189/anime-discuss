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
import { useAuth } from '@/store/useAuth';
import { timeAgo } from '@/lib/utils';
import { toast } from 'sonner';

import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function Thread({
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
    const { user } = useAuth();

    async function handleDelete() {
        try {
            const response = await fetch(`/api/thread/${user ? 'auth' : 'public'}/${_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to delete thread: ${response.statusText}`);
            }

            const deleted = await response.json();
            toast.success('Thread deleted!');
            console.log('Thread deleted:', deleted);
        } catch (error) {
            toast.error('Error deleting thread.');
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
                        ? comments.map((comment) => (
                              <Comment
                                  key={comment._id}
                                  _id={comment._id}
                                  __v={comment.__v}
                                  mal_id={mal_id}
                                  thread={comment.thread}
                                  author={comment.author}
                                  content={comment.content}
                                  createdAt={comment.createdAt}
                              />
                          ))
                        : null}
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
