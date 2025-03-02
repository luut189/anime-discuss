import { IThread } from '@/common/interfaces';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Thread from '@/components/thread/Thread';

import { useQuery } from '@tanstack/react-query';

interface ThreadsProp {
    id: string;
}

export default function Threads({ id }: ThreadsProp) {
    const { data, isPending } = useQuery({
        queryKey: [`threads-${id}`],
        queryFn: async () => {
            try {
                const response = await fetch(`/api/thread/${id}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch threads: ${response.statusText}`);
                }

                const data: IThread[] = await response.json();
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        enabled: !!id,
        retry: 5,
    });

    if (isPending) {
        return (
            <>
                {Array.from({ length: 2 }).map((_, idx) => (
                    <Card key={idx}>
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
                ))}
            </>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className='flex items-center justify-center rounded-lg border p-4'>
                No threads created here. Want to start something?
            </div>
        );
    }

    return (
        <>
            {data.map((thread) => (
                <Thread
                    key={thread._id}
                    __v={thread.__v}
                    _id={thread._id}
                    mal_id={thread.mal_id}
                    title={thread.title}
                    author={thread.author}
                    authorId={thread.authorId}
                    content={thread.content}
                    comments={thread.comments}
                    createdAt={thread.createdAt}
                    updatedAt={thread.updatedAt}
                />
            ))}
        </>
    );
}
