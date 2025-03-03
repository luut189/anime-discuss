import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { fetchTodayAnimeData, fetchTrendingAnimeData } from '@/api/anime';
import { REFRESH_INTERVAL } from '@/common/constants';
import AnimeCardGrid from '@/components/anime/AnimeCardGrid';
import ErrorFallback from '@/components/ErrorFallback';
import { useNavigate } from 'react-router';

const MAX_ITEMS = 6;

function TodayAnimeDisplay() {
    const { isError, isPending, data } = useQuery({
        queryKey: ['today-anime'],
        queryFn: fetchTodayAnimeData,
        refetchInterval: REFRESH_INTERVAL,
        retry: 5,
        staleTime: 1000 * 60 * 5,
    });
    const [showAll, setShowAll] = useState(false);

    function getItems() {
        if (isPending || !data) return Array.from({ length: MAX_ITEMS }).map(() => null);

        if (data?.data.length > MAX_ITEMS && !showAll) return data.data.slice(0, MAX_ITEMS);

        return data.data;
    }

    return (
        <>
            <div className='flex w-full flex-row'>
                <div className='mb-2 mr-auto text-xl font-bold'>Today Anime</div>
                {data && data.data.length > MAX_ITEMS ? (
                    <Button
                        variant={'link'}
                        className='mb-2 flex items-center justify-center text-muted-foreground transition-colors hover:text-primary'
                        onClick={() => {
                            setShowAll(!showAll);
                        }}>
                        {showAll ? 'Show Less' : 'Show All'}
                    </Button>
                ) : null}
            </div>
            {isError ? (
                <ErrorFallback errorMessage='Error Fetching Today Anime' />
            ) : (
                <AnimeCardGrid isPendingData={isPending} items={getItems()} />
            )}
        </>
    );
}

function TrendingAnimeDisplay() {
    const { isError, isPending, data } = useQuery({
        queryKey: ['trending-anime', 1],
        queryFn: () => fetchTrendingAnimeData(1, MAX_ITEMS),
        refetchInterval: REFRESH_INTERVAL,
        retry: 5,
        staleTime: 1000 * 60 * 5,
    });
    const navigate = useNavigate();

    return (
        <>
            <div className='flex w-full flex-row'>
                <div className='mb-2 mr-auto text-xl font-bold'>Trending Anime</div>
                <Button
                    variant={'link'}
                    className='mb-2 flex items-center justify-center text-muted-foreground transition-colors hover:text-primary'
                    onClick={() => navigate('/anime/trending')}>
                    Show All
                </Button>
            </div>
            {isError ? (
                <ErrorFallback errorMessage='Error Fetching Trending Anime' />
            ) : (
                <AnimeCardGrid
                    isPendingData={isPending}
                    items={
                        data
                            ? data.data.slice(0, MAX_ITEMS)
                            : Array.from({ length: MAX_ITEMS }).map(() => null)
                    }
                />
            )}
        </>
    );
}

export { TodayAnimeDisplay, TrendingAnimeDisplay };
