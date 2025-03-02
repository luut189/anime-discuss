import { JikanAnimeData } from '@/common/interfaces';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Skeleton } from '@/components/ui/skeleton';
import usePinAnime from '@/hooks/usePinAnime';
import useAuthStore from '@/store/useAuthStore';

import { CirclePlay, CircleCheck, CircleHelp, Star, Pin, PinOff } from 'lucide-react';
import { useNavigate } from 'react-router';

function AnimeCard({
    mal_id,
    images,
    title,
    title_japanese,
    episodes,
    score,
    status,
    genres,
}: JikanAnimeData) {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { isPinned, handlePin } = usePinAnime(user, mal_id, title);

    return (
        <>
            <HoverCard>
                <HoverCardTrigger>
                    <img
                        src={images.jpg.large_image_url}
                        alt={title}
                        onClick={() => {
                            navigate(`/anime/${mal_id}`);
                        }}
                        className='h-48 w-32 cursor-pointer rounded-sm shadow-md transition-all hover:scale-105'
                    />
                </HoverCardTrigger>
                <HoverCardContent className='flex w-full flex-col gap-3'>
                    <div className='flex flex-row'>
                        <div className='ml-auto w-72'>
                            <div className='font-bold'>{title || 'Untitled'}</div>
                            <div className='text-sm'>
                                {title_japanese || 'Unknown Japanese Title'}
                            </div>
                        </div>
                        <div className='mr-auto flex flex-row items-start justify-end gap-2 font-bold'>
                            {score}
                            <Star color='#fef084' fill='#fef083' />
                        </div>
                    </div>
                    <div className='flex gap-3'>
                        <div className='mr-auto flex flex-row items-center justify-center gap-1'>
                            {getAiringStatusIcon(status)}
                            {status || 'Unknown Status'}
                        </div>
                        <div className='ml-auto flex flex-row items-center justify-center'>
                            {episodes || '?'} episodes
                        </div>
                    </div>
                    <div className='flex items-center justify-between'>
                        <div className='flex flex-wrap gap-1'>
                            {genres.map((genre) => (
                                <div
                                    key={genre.name}
                                    className='flex gap-1 rounded-md border bg-primary/10 p-1 text-xs font-bold'>
                                    {genre.name}
                                </div>
                            ))}
                        </div>
                        {user ? (
                            <Button
                                size='icon'
                                variant={isPinned ? 'destructive' : 'default'}
                                onClick={handlePin}>
                                {isPinned ? <PinOff /> : <Pin />}
                            </Button>
                        ) : null}
                    </div>
                </HoverCardContent>
            </HoverCard>
            <div className='line-clamp-2 w-32 break-words text-sm'>{title}</div>
        </>
    );
}

function AnimeCardSkeleton() {
    return (
        <>
            <Skeleton className='h-48 w-32' />
            <Skeleton className='h-3 w-32' />
        </>
    );
}

function getAiringStatusIcon(status: string) {
    if (status === 'Currently Airing') return <CirclePlay size={16} className='text-green-500' />;
    else if (status === 'Finished Airing')
        return <CircleCheck size={16} className='text-red-500' />;
    else {
        return <CircleHelp size={16} className='text-purple-500' />;
    }
}

export { AnimeCard, AnimeCardSkeleton };
