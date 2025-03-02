import { IThread } from '@/common/interfaces';
import { Thread, ThreadSkeleton } from '@/components/thread/Thread';

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
