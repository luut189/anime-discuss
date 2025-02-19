import { JikanAnimeData } from '@/common/interfaces';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Skeleton } from '@/components/ui/skeleton';
import { CirclePlay, CircleCheck, CircleHelp, Star } from 'lucide-react';
import { useNavigate } from 'react-router';

interface AnimeCardProp {
    animeData: JikanAnimeData;
}

function AnimeCard({ animeData }: AnimeCardProp) {
    const navigate = useNavigate();
    return (
        <>
            <HoverCard>
                <HoverCardTrigger>
                    <img
                        src={animeData.images.jpg.large_image_url}
                        alt={animeData.title_english}
                        onClick={() => {
                            navigate(`/anime/${animeData.mal_id}`);
                        }}
                        className='h-48 w-32 cursor-pointer rounded-sm shadow-md transition-all hover:scale-105'
                    />
                </HoverCardTrigger>
                <HoverCardContent className='flex w-full flex-col gap-3'>
                    <div className='flex flex-row'>
                        <div className='ml-auto w-72'>
                            <div className='font-bold'>{animeData.title || 'Untitled'}</div>
                            <div className='text-sm'>
                                {animeData.title_english || 'Unknown English Title'}
                            </div>
                        </div>
                        <div className='mr-auto flex flex-row items-start justify-end gap-2 font-bold'>
                            {animeData.score}
                            <Star color='#fef084' fill='#fef083' />
                        </div>
                    </div>
                    <div className='flex gap-3'>
                        <div className='mr-auto flex flex-row items-center justify-center gap-1'>
                            {getAiringStatusIcon(animeData.status)}
                            {animeData.status || 'Unknown Status'}
                        </div>
                        <div className='ml-auto flex flex-row items-center justify-center'>
                            {animeData.episodes || '?'} episodes
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-1'>
                        {animeData.genres.map((genre) => (
                            <div
                                key={genre.name}
                                className='flex gap-1 rounded-md border bg-blue-200 p-1 text-xs font-bold'>
                                {genre.name}
                            </div>
                        ))}
                    </div>
                </HoverCardContent>
            </HoverCard>
            <div className='line-clamp-2 w-32 break-words text-sm'>{animeData.title}</div>
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
