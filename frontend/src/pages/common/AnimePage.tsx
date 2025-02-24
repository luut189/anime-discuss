import { Button } from '@/components/ui/button';
import { JikanData } from '@/common/interfaces';
import AnimeCardGrid from '@/components/anime/AnimeCardGrid';
import ErrorFallback from '@/components/ErrorFallback';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AnimePageProps {
    title: string;
    isError: boolean;
    isPending: boolean;
    data: JikanData | undefined;
    page: number;
    setPage: (arg: number) => void;
}

export default function AnimePage({
    title,
    isError,
    isPending,
    data,
    page,
    setPage,
}: AnimePageProps) {
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
