import { getPinnedAnime, getUserThreads } from '@/api/user';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AnimeCardGrid from '@/components/anime/AnimeCardGrid';
import { Thread, ThreadSkeleton } from '@/components/thread/Thread';
import useAuthStore from '@/store/useAuthStore';

import { useQuery } from '@tanstack/react-query';
import { WEEKDAYS } from '@/common/constants';
import { Navigate } from 'react-router';

export default function ProfilePage() {
    const { user } = useAuthStore();
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
    const { user } = useAuthStore();
    const { data, isPending } = useQuery({
        queryKey: ['threads', user?._id],
        queryFn: getUserThreads,
        enabled: !!user,
        retry: 5,
        staleTime: 1000 * 60 * 5,
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
    const { user } = useAuthStore();
    const { data: pinnedAnime, isPending } = useQuery({
        queryKey: ['pinned-anime', user?._id],
        queryFn: getPinnedAnime,
        enabled: !!user,
        retry: 5,
        staleTime: 1000 * 60 * 5,
    });

    const todayAnime = pinnedAnime?.filter(
        (anime) =>
            anime.broadcast.day.slice(0, -1) === WEEKDAYS[new Date().getDay()] && anime.airing,
    );

    const animeList = type === 'today' ? todayAnime : pinnedAnime;

    if (!isPending && (!animeList || animeList.length === 0)) {
        return (
            <div className='flex items-center justify-center rounded-lg border p-4'>
                {type === 'today'
                    ? 'There is nothing broadcast today that you like :('
                    : 'There is nothing here but loneliness...'}
            </div>
        );
    }

    return <AnimeCardGrid isPendingData={isPending} items={animeList || Array(5).fill(null)} />;
}
