import { JikanAnimeData } from '@/common/interfaces';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/store/useAuth';

import { Heart, Pin, PinOff, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AnimeInfo({
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
}: JikanAnimeData) {
    const { user } = useAuth();
    const [isPinned, setIsPinned] = useState(false);

    useEffect(() => {
        if (user && user.pinnedAnime) setIsPinned(user.pinnedAnime.includes(`${mal_id}`));
    }, [user, mal_id]);

    async function handlePin() {
        if (!user) return;
        try {
            if (isPinned) {
                const response = await fetch('/api/user/pinnedAnime', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mal_id }),
                });
                if (response.ok) {
                    toast.success(`Unpinned ${title}`);
                    setIsPinned(false);
                }
                return;
            }
            const response = await fetch('/api/user/pinnedAnime', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mal_id }),
            });
            if (response.ok) {
                toast.success(`Pinned ${title}`);
                setIsPinned(true);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='rounded-lg bg-muted/50 p-6'>
            <div className='flex flex-col gap-6 md:flex-row'>
                <div className='flex-shrink-0'>
                    <img src={images.jpg.image_url} alt={title} className='rounded-lg' />
                </div>
                <div className='flex-grow'>
                    <div className='flex justify-between'>
                        <div>
                            <h2 className='mb-2 text-2xl font-bold'>{title}</h2>
                            <p className='mb-4 text-sm text-muted-foreground'>{title_japanese}</p>
                        </div>
                        <Button variant={isPinned ? 'destructive' : 'default'} onClick={handlePin}>
                            {user ? (
                                isPinned ? (
                                    <>
                                        <PinOff /> Unpin
                                    </>
                                ) : (
                                    <>
                                        <Pin /> Pin
                                    </>
                                )
                            ) : null}
                        </Button>
                    </div>
                    <div className='mb-4 grid grid-cols-2 gap-4'>
                        <div>
                            <p className='text-sm font-semibold'>
                                Type: <span className='font-normal'>{type}</span>
                            </p>
                            <p className='text-sm font-semibold'>
                                Episodes: <span className='font-normal'>{episodes}</span>
                            </p>
                            <p className='text-sm font-semibold'>
                                Status: <span className='font-normal'>{status}</span>
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
                                    {score} ({scored_by} votes)
                                </span>
                            </p>
                            <p className='flex items-center text-sm font-semibold'>
                                <Heart className='mr-1 h-4 w-4 text-red-400' />
                                Favorites:{' '}
                                <span className='ml-1 font-normal'>
                                    {favorites.toLocaleString()}
                                </span>
                            </p>
                        </div>
                    </div>
                    <p className='mb-4 text-sm'>{synopsis}</p>
                    <div className='flex flex-wrap gap-2'>
                        {genres.map((genre) => (
                            <span
                                key={genre.mal_id}
                                className='rounded-full bg-primary/10 px-2 py-1 text-xs text-primary'>
                                {genre.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
