import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { fetchTodayAnimeData, fetchTopAnimeData } from '@/api/anime';
import { REFRESH_INTERVAL } from '@/common/constants';
import AnimeCardGrid from '@/components/anime/AnimeCardGrid';
import ErrorFallback from '@/components/common/ErrorFallback';
import { useBreakpoint } from '@/hooks/useBreakpoint';

function getMaxItems(breakpoint: string) {
    switch (breakpoint) {
        case '2xl':
            return 7;
        case 'xl':
            return 6;
        case 'lg':
            return 6;
        case 'md':
            return 4;
        case 'sm':
            return 3;
        case 'base':
            return 2;
        default:
            return 2;
    }
}

function TodayAnimeDisplay() {
    const breakpoint = useBreakpoint();
    const maxItems = getMaxItems(breakpoint);

    const { isError, isPending, data } = useQuery({
        queryKey: ['today-anime'],
        queryFn: fetchTodayAnimeData,
        refetchInterval: REFRESH_INTERVAL,
        retry: 5,
        staleTime: 1000 * 60 * 5,
    });
    const [showAll, setShowAll] = useState(false);

    function getItems() {
        if (isPending || !data) return Array.from({ length: maxItems }).map(() => null);

        if (data.length > maxItems && !showAll) return data.slice(0, maxItems);

        return data;
    }

    return (
        <>
            <div className='flex w-full flex-row'>
                <div className='mb-2 mr-auto text-xl font-bold'>Today Anime</div>
                {data && data.length > maxItems ? (
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

function TopAnimeDisplay() {
    const breakpoint = useBreakpoint();
    const maxItems = getMaxItems(breakpoint);
    const { isError, isPending, data } = useQuery({
        queryKey: ['trending-anime', 0],
        queryFn: () => fetchTopAnimeData(1, maxItems),
        refetchInterval: REFRESH_INTERVAL,
        retry: 5,
        staleTime: 1000 * 60 * 5,
    });

    return (
        <>
            <div className='flex w-full flex-row'>
                <div className='mb-2 mr-auto text-xl font-bold'>Top Anime</div>
                <a href='/anime/top'>
                    <Button
                        variant={'link'}
                        className='mb-2 flex items-center justify-center text-muted-foreground transition-colors hover:text-primary'>
                        Show All
                    </Button>
                </a>
            </div>
            {isError ? (
                <ErrorFallback errorMessage='Error Fetching Trending Anime' />
            ) : (
                <AnimeCardGrid
                    isPendingData={isPending}
                    items={
                        data
                            ? data.data.slice(0, maxItems)
                            : Array.from({ length: maxItems }).map(() => null)
                    }
                />
            )}
        </>
    );
}

export { TodayAnimeDisplay, TopAnimeDisplay };
