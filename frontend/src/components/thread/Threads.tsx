import { getThreadsByMalId } from '@/api/thread';
import { Thread, ThreadSkeleton } from '@/components/thread/Thread';

import { useQuery } from '@tanstack/react-query';

interface ThreadsProp {
    id: string;
}

export default function Threads({ id }: ThreadsProp) {
    const { data, isPending } = useQuery({
        queryKey: [`threads-${id}`],
        queryFn: () => getThreadsByMalId(id),
        enabled: !!id,
    });

    if (isPending) {
        return (
            <>
                {Array.from({ length: 2 }).map((_, idx) => (
                    <ThreadSkeleton key={idx} />
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
                <Thread key={thread._id} {...thread} />
            ))}
        </>
    );
}
