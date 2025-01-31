import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { AnimeCard, AnimeCardSkeleton } from '@/components/AnimeCard';
import { fetchTodayAnimeData } from '@/common/query';
import { JikanAnimeData } from '@/common/interfaces';

const REFRESH_INTERVAL = 1000 * 60;
const MAX_ITEMS = 6;

export default function TodayAnimeDisplay() {
    const { isPending, data } = useQuery({
        queryKey: [`today-anime`],
        queryFn: fetchTodayAnimeData,
        refetchInterval: REFRESH_INTERVAL,
        retry: 5
    });
    const [showAll, setShowAll] = useState(false);

    function getItemArray() {
        if (isPending || !data) return Array.from({ length: MAX_ITEMS }).map(() => null);

        if (data?.data.length > MAX_ITEMS && !showAll) return data.data.slice(0, MAX_ITEMS);

        return data.data;
    }

    return (
        <>
            <div className='flex w-full flex-row p-3 px-4'>
                <div className='mb-2 mr-auto text-xl font-bold'>Today Anime</div>
                <Button
                    variant={'link'}
                    className='mb-2 flex items-center justify-center text-muted-foreground transition-colors hover:text-primary'
                    onClick={() => {
                        setShowAll(!showAll);
                    }}>
                    {showAll ? 'Show Less' : 'Show All'}
                </Button>
            </div>
            <div className='mb-3 grid w-full max-w-7xl grid-cols-2 gap-4 px-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7'>
                {getItemArray().map((anime, index) => (
                    <div key={index} className='flex flex-col gap-2 justify-self-center'>
                        {isPending ? (
                            <AnimeCardSkeleton />
                        ) : (
                            <AnimeCard animeData={anime as JikanAnimeData} />
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
