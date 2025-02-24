import { fetchTrendingAnimeData } from '@/common/query';
import { REFRESH_INTERVAL } from '@/common/constants';
import { Button } from '@/components/ui/button';
import AnimeCardGrid from '@/components/anime/AnimeCardGrid';
import ErrorFallback from '@/components/ErrorFallback';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TrendingAnimePage() {
    const [page, setPage] = useState(1);
    const { isError, isPending, data } = useQuery({
        queryKey: [`trending-anime-${page}`],
        queryFn: () => fetchTrendingAnimeData(page),
        refetchInterval: REFRESH_INTERVAL,
        retry: 5,
    });

    function handleNext() {
        if (!data) return;
        setPage(page < data.pagination.last_visible_page ? page + 1 : page);
    }

    function handlePrevious() {
        if (!data) return;
        setPage(page > 1 ? page - 1 : page);
    }

    return (
        <>
            <div className='flex w-full flex-row p-3 px-4'>
                <div className='mb-2 mr-auto text-xl font-bold'>Trending Anime</div>
            </div>
            {isError ? (
                <ErrorFallback errorMessage='Error Fetching Trending Anime' />
            ) : (
                <div className='flex w-full flex-col'>
                    <AnimeCardGrid
                        isPendingData={isPending}
                        items={data ? data.data : Array.from({ length: 25 }).map(() => null)}
                    />
                    <div className='flex items-center justify-center gap-5'>
                        <Button size={'icon'} onClick={handlePrevious}>
                            <ChevronLeft />
                        </Button>
                        <Button variant={'outline'} className='disabled:opacity-100' disabled>
                            {page} / {data?.pagination.last_visible_page}
                        </Button>
                        <Button size={'icon'} onClick={handleNext}>
                            <ChevronRight />
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
