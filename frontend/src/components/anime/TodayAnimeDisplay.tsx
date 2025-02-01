import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { fetchTodayAnimeData } from '@/common/query';
import AnimeCardGrid from '@/components/anime/AnimeCardGrid';
import ErrorFallback from '@/components/ErrorFallback';

const REFRESH_INTERVAL = 1000 * 60;
const MAX_ITEMS = 6;

export default function TodayAnimeDisplay() {
    const { isError, isPending, data } = useQuery({
        queryKey: [`today-anime`],
        queryFn: fetchTodayAnimeData,
        refetchInterval: REFRESH_INTERVAL,
        retry: 5,
    });
    const [showAll, setShowAll] = useState(false);

    function getItems() {
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
            {isError ? (
                <ErrorFallback errorMessage='Error Fetching Today Anime' />
            ) : (
                <AnimeCardGrid isPendingData={isPending} items={getItems()} />
            )}
        </>
    );
}
