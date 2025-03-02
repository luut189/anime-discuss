import { fetchAnimeById } from '@/common/query';
import { IThread, JikanAnimeData } from '@/common/interfaces';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AnimeCardGrid from '@/components/anime/AnimeCardGrid';
import { Thread, ThreadSkeleton } from '@/components/thread/Thread';
import { useAuth } from '@/store/useAuth';

import { useQuery } from '@tanstack/react-query';
import { WEEKDAYS } from '@/common/constants';
import { Navigate } from 'react-router';
import { delay } from '@/lib/utils';

export default function ProfilePage() {
    const { user } = useAuth();
    if (!user) return <Navigate to='/auth/login' />;
    return (
        <div className='flex flex-col items-center justify-center gap-4'>
            <Card className='w-2/3'>
                <CardHeader>
                    <div className='flex flex-col items-center justify-center gap-2'>
                        <Avatar className='h-32 w-32'>
                            <AvatarImage src={user.image} alt={user.username} />
                            <AvatarFallback>
                                {user.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <CardTitle className='text-2xl'>Hello {user.username}!</CardTitle>
                    </div>
                </CardHeader>
            </Card>
            <div className='flex w-full flex-col gap-4'>
                <h2 className='text-2xl font-bold'>Threads</h2>
                <ThreadsContainer />
            </div>
            <div className='flex w-full flex-col gap-4'>
                <h2 className='text-2xl font-bold'>Today Anime</h2>
                <AnimeContainer type='today' />
            </div>
            <div className='flex w-full flex-col gap-4'>
                <h2 className='text-2xl font-bold'>Pinned Anime</h2>
                <AnimeContainer type='pinned' />
            </div>
        </div>
    );
}

function ThreadsContainer() {
    const { user } = useAuth();
    const { data, isPending } = useQuery({
        queryKey: ['threads', user?._id],
        queryFn: async () => {
            try {
                const response = await fetch('/api/user/threads');

                if (!response.ok) {
                    throw new Error(`Failed to fetch threads: ${response.statusText}`);
                }

                const data: IThread[] = await response.json();
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        enabled: !!user,
        retry: 5,
    });

    if (isPending) {
        return <ThreadSkeleton />;
    }

    if (!data || data.length === 0) {
        return (
            <div className='flex items-center justify-center rounded-lg border p-4'>
                You haven't created any thread yet. Want to start something?
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

interface AnimeContainerProps {
    type: 'today' | 'pinned';
}
function AnimeContainer({ type }: AnimeContainerProps) {
    const { user } = useAuth();
    const { data, isPending } = useQuery({
        queryKey: ['pinned-anime', user?._id],
        queryFn: async () => {
            try {
                const response = await fetch('/api/user/pinnedAnime');

                if (!response.ok) {
                    throw new Error(`Failed to fetch threads: ${response.statusText}`);
                }

                const list: string[] = (await response.json()).pinnedAnime;

                const animeData: JikanAnimeData[] = (
                    await Promise.all(
                        list.map(async (mal_id) => {
                            await delay(100);
                            return await fetchAnimeById(mal_id);
                        }),
                    )
                ).filter((anime) => anime !== undefined);

                return animeData;
            } catch (error) {
                console.log(error);
            }
        },
        enabled: !!user,
        retry: 5,
    });

    if (!data || data.length === 0) {
        return (
            <div className='flex items-center justify-center rounded-lg border p-4'>
                There is nothing here but loneliness...
            </div>
        );
    }

    const todayData = data.filter(
        (anime) => anime.broadcast.day.slice(0, -1) === WEEKDAYS[new Date().getDay()],
    );

    if (type === 'today' && (!todayData || todayData.length === 0)) {
        return (
            <div className='flex items-center justify-center rounded-lg border p-4'>
                There is nothing broadcast today that you like :(
            </div>
        );
    }

    return (
        <AnimeCardGrid
            isPendingData={isPending}
            items={
                data
                    ? type === 'pinned'
                        ? data
                        : todayData
                    : Array.from({ length: 5 }).map(() => null)
            }
        />
    );
}
