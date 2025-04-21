import { JikanData } from '@/common/interfaces';
import AnimeCardGrid from '@/components/anime/AnimeCardGrid';
import ErrorFallback from '@/components/ErrorFallback';
import Pagination from '@/components/ui/pagination';
import { useEffect } from 'react';

interface AnimePageProps {
    title: string;
    isError: boolean;
    isPending: boolean;
    data: JikanData | undefined;
    page: number;
    move: (_: 'next' | 'prev') => void;
    moveToPage: (_: number) => void;
}

export default function AnimePage({
    title,
    isError,
    isPending,
    data,
    page,
    move,
    moveToPage,
}: AnimePageProps) {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

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
                        page={page}
                        isPendingData={isPending}
                        items={data ? data.data : Array.from({ length: 25 }).map(() => null)}
                    />
                    <div className='flex items-center justify-center gap-5'>
                        <Pagination
                            page={page}
                            lastVisiblePage={
                                data?.pagination.last_visible_page || Number.MAX_SAFE_INTEGER
                            }
                            move={move}
                            moveToPage={moveToPage}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
