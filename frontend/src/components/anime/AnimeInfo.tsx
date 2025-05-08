import { JikanAnimeData } from '@/common/interfaces';
import { PinAnimeButton } from '@/components/anime/PinAnimeButton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/utils';
import useAuthStore from '@/store/useAuthStore';

import { ChevronUp, Heart, SquareUser, Star, Tv } from 'lucide-react';
import { useState } from 'react';
import EpisodeTracker from './EpisodeTracker';

interface AnimeInfoProps extends JikanAnimeData {
    showVoice: boolean;
    setShowVoice: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AnimeInfo(props: AnimeInfoProps) {
    const {
        mal_id,
        images,
        title,
        title_japanese,
        type,
        episodes,
        aired,
        score,
        scored_by,
        status,
        synopsis,
        genres,
        favorites,
        showVoice,
        setShowVoice,
    } = props;
    const { user } = useAuthStore();
    const [showTracker, setShowTracker] = useState(false);

    return (
        <div className='flex flex-col gap-2 rounded-lg bg-muted/50 p-6'>
            <div className='flex flex-col gap-6 md:flex-row'>
                <div className='flex-shrink-0'>
                    <img src={images.jpg.image_url} alt={title} className='rounded-lg' />
                </div>
                <div className='flex flex-grow flex-col'>
                    <div className='flex justify-between'>
                        <div className='w-2/3'>
                            <h2 className='mb-2 text-2xl font-bold'>{title || 'Unknown Title'}</h2>
                            <p className='mb-4 text-sm text-muted-foreground'>
                                {title_japanese || 'Unknown Japanese Title'}
                            </p>
                        </div>
                        {user ? <PinAnimeButton mal_id={mal_id} title={title} /> : null}
                    </div>
                    <div className='mb-4 flex grid-cols-2 flex-col gap-0 sm:grid sm:gap-4'>
                        <div>
                            <p className='text-sm font-semibold'>
                                Type: <span className='font-normal'>{type || 'Unknown'}</span>
                            </p>
                            <p className='text-sm font-semibold'>
                                Episodes:{' '}
                                <span className='font-normal'>{episodes || 'Unknown'}</span>
                            </p>
                            <p className='text-sm font-semibold'>
                                Status: <span className='font-normal'>{status || 'Unknown'}</span>
                            </p>
                            <p className='text-sm font-semibold'>
                                Aired:{' '}
                                <span className='font-normal'>
                                    {aired.from ? `From ${formatDate(aired.from)}` : 'Unknown'}
                                    {aired.to && ` to ${formatDate(aired.to)}`}
                                </span>
                            </p>
                        </div>
                        <div>
                            <p className='flex items-center text-sm font-semibold'>
                                <Star className='mr-1 h-4 w-4 text-yellow-400' />
                                Score:{' '}
                                <span className='ml-1 font-normal'>
                                    {score || '?'} ({scored_by || '?'} votes)
                                </span>
                            </p>
                            <p className='flex items-center text-sm font-semibold'>
                                <Heart className='mr-1 h-4 w-4 text-red-400' />
                                Favorites:{' '}
                                <span className='ml-1 font-normal'>
                                    {favorites ? favorites.toLocaleString() : '?'}
                                </span>
                            </p>
                        </div>
                    </div>
                    <Separator />
                    <p className='my-4 flex-grow text-sm'>{synopsis}</p>
                    <Separator className='mb-2' />
                    <div className='flex items-center justify-between'>
                        <div className='flex flex-wrap gap-2'>
                            {genres.map((genre) => (
                                <span
                                    key={genre.mal_id}
                                    className='rounded-full bg-primary/10 px-2 py-1 text-xs text-primary'>
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                        <div className='flex flex-col items-end sm:flex-row'>
                            <Button variant={'ghost'} onClick={() => setShowTracker(!showTracker)}>
                                <Tv />
                                Episode Tracker
                                <ChevronUp
                                    className={
                                        'transition-transform' + (showTracker ? '' : ' rotate-180')
                                    }
                                />
                            </Button>
                            <Button variant={'ghost'} onClick={() => setShowVoice(!showVoice)}>
                                <SquareUser />
                                Seiyuu Info
                                <ChevronUp
                                    className={
                                        'transition-transform' + (showVoice ? '' : ' rotate-180')
                                    }
                                />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {showTracker ? <EpisodeTracker {...props} /> : null}
        </div>
    );
}
