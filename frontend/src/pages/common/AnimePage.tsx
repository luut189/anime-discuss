import { Button } from '@/components/ui/button';
import { JikanData } from '@/common/interfaces';
import AnimeCardGrid from '@/components/anime/AnimeCardGrid';
import ErrorFallback from '@/components/ErrorFallback';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SetURLSearchParams } from 'react-router';

interface AnimePageProps {
    title: string;
    isError: boolean;
    isPending: boolean;
    data: JikanData | undefined;
    page: number;
    setPage: (arg: number) => void;
    setSearchParams: SetURLSearchParams;
}

export default function AnimePage({
    title,
    isError,
    isPending,
    data,
    page,
    setPage,
    setSearchParams,
}: AnimePageProps) {
    function handleNext() {
        if (!data) return;
        setSearchParams((prev) => {
            prev.set('page', `${page + 1}`);
            return prev;
        });
        setPage(page < data.pagination.last_visible_page ? page + 1 : page);
    }

    function handlePrevious() {
        if (!data) return;
        setSearchParams((prev) => {
            prev.set('page', `${page - 1}`);
            return prev;
        });
        setPage(page > 1 ? page - 1 : page);
    }

    return (
        <>
            <div className='flex w-full flex-row p-3 px-4'>
                <div className='mb-2 mr-auto text-xl font-bold'>{title}</div>
            </div>
            {isError ? (
                <ErrorFallback errorMessage={`Error Fetching ${title}`} />
            ) : (
                <div className='flex w-full flex-col'>
                    <AnimeCardGrid
                        isPendingData={isPending}
                        items={data ? data.data : Array.from({ length: 25 }).map(() => null)}
                    />
                    <div className='flex items-center justify-center gap-5'>
                        <Button size={'icon'} onClick={handlePrevious} disabled={page == 1}>
                            <ChevronLeft />
                        </Button>
                        <Button
                            size={'icon'}
                            onClick={handleNext}
                            disabled={page == data?.pagination.last_visible_page}>
                            <ChevronRight />
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
