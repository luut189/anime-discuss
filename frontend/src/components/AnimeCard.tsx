import { JikanAnimeData } from '@/common/interfaces';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Skeleton } from '@/components/ui/skeleton';
import { CirclePlay, CircleCheck } from 'lucide-react';

function AnimeCard(animeCardProp: { animeData: JikanAnimeData }) {
    return (
        <>
            <HoverCard>
                <HoverCardTrigger>
                    <img
                        src={animeCardProp.animeData.images.jpg.large_image_url}
                        alt={animeCardProp.animeData.title_english}
                        className='h-48 w-32 rounded-sm shadow-md'
                    />
                </HoverCardTrigger>
                <HoverCardContent className='flex w-full flex-col gap-3'>
                    <div>
                        <div className='font-bold'>{animeCardProp.animeData.title}</div>
                        <div className='text-sm'>{animeCardProp.animeData.title_english}</div>
                    </div>
                    <div className='flex gap-3'>
                        <div className='mr-auto flex flex-row items-center justify-center gap-1'>
                            {getAiringStatusIcon(animeCardProp.animeData.status)}
                            {animeCardProp.animeData.status}
                        </div>
                        <div className='ml-auto flex flex-row items-center justify-center'>
                            {animeCardProp.animeData.episodes} episodes
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-1'>
                        {animeCardProp.animeData.genres.map((genre) => (
                            <div
                                key={genre.name}
                                className='rounded-md border bg-blue-200 p-1 text-sm'>
                                {genre.name}
                            </div>
                        ))}
                    </div>
                </HoverCardContent>
            </HoverCard>
            <div className='line-clamp-2 w-32 break-words text-sm'>
                {animeCardProp.animeData.title}
            </div>
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
        return <></>;
    }
}

export { AnimeCard, AnimeCardSkeleton };
