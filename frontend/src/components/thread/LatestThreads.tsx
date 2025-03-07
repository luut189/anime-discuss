import { Button } from '@/components/ui/button';
import ErrorFallback from '@/components/ErrorFallback';
import { Thread, ThreadSkeleton } from '@/components/thread/Thread';
import { getAllThreads } from '@/api/thread';

import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';

const MAX_ITEMS = 5;

export default function LatestThreads() {
    const navigate = useNavigate();
    const { data, isError, isPending } = useQuery({
        queryKey: ['all-threads'],
        queryFn: getAllThreads,
        retry: 5,
    });

    return (
        <>
            <div className='flex w-full flex-row'>
                <div className='mb-2 mr-auto text-xl font-bold'>Recent Threads</div>
                {data && data.length > MAX_ITEMS ? (
                    <Button
                        variant={'link'}
                        className='mb-2 flex items-center justify-center text-muted-foreground transition-colors hover:text-primary'
                        onClick={() => navigate('/thread/recent')}>
                        Show All
                    </Button>
                ) : null}
            </div>
            <div className='flex flex-col gap-2'>
                {isPending ? (
                    <>
                        {Array.from({ length: 2 }).map((_, idx) => (
                            <ThreadSkeleton key={idx} />
                        ))}
                    </>
                ) : isError || !data ? (
                    <ErrorFallback errorMessage='Error Fetching Recent Threads' />
                ) : (
                    data.slice(0, MAX_ITEMS).map((thread) => <Thread {...thread} />)
                )}
            </div>
        </>
    );
}
