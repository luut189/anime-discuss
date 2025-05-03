import { Button } from '@/components/ui/button';
import ErrorFallback from '@/components/common/ErrorFallback';
import { Thread, ThreadSkeleton } from '@/components/thread/Thread';
import { getAllThreads } from '@/api/thread';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const TO_ADD = 3;

export default function LatestThreads() {
    const [count, setCount] = useState(TO_ADD);
    const { data, isError, isPending } = useQuery({
        queryKey: ['all-threads'],
        queryFn: getAllThreads,
        retry: 5,
    });

    return (
        <>
            <div className='mb-2 mr-auto text-xl font-bold'>Recent Threads</div>
            <div className='flex flex-col gap-4'>
                {isPending ? (
                    <>
                        {Array.from({ length: 2 }).map((_, idx) => (
                            <ThreadSkeleton key={idx} />
                        ))}
                    </>
                ) : isError || !data ? (
                    <ErrorFallback errorMessage='Error Fetching Recent Threads' />
                ) : (
                    data.slice(0, count).map((thread) => <Thread key={thread._id} {...thread} />)
                )}
                {data ? (
                    <Button
                        variant={'outline'}
                        onClick={() => setCount(count < data.length ? count + TO_ADD : TO_ADD)}>
                        Show {count < data.length ? 'More' : 'Less'} Threads
                    </Button>
                ) : null}
            </div>
        </>
    );
}
