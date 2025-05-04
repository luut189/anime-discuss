import ShowMoreButton from '@/components/common/ShowMoreButton';
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
            <h1 className='mb-2 mr-auto text-xl font-bold'>Recent Threads</h1>
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
                    <ShowMoreButton
                        count={count}
                        setCount={setCount}
                        length={data.length}
                        range={TO_ADD}
                    />
                ) : null}
            </div>
        </>
    );
}
