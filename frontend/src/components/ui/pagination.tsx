import { Button } from '@/components/ui/button';
import { ChevronLeft, Ellipsis, ChevronRight } from 'lucide-react';

interface PaginationProps {
    page: number;
    lastVisiblePage: number;
    move: (_: 'next' | 'prev') => void;
    moveToPage: (_: number) => void;
}

export default function Pagination({ page, lastVisiblePage, move, moveToPage }: PaginationProps) {
    const pageRange = 2;
    const startPage = Math.max(1, page - pageRange);
    const endPage = Math.min(lastVisiblePage, page + pageRange);
    const pages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

    return (
        <>
            <Button
                size={'icon'}
                variant={'ghost'}
                onClick={() => move('prev')}
                disabled={page == 1}>
                <ChevronLeft />
            </Button>
            <div className='flex gap-2'>
                {page > pageRange + 1 && (
                    <>
                        <Button onClick={() => moveToPage(1)}>1</Button>
                        <div className='mx-2 flex items-center justify-center'>
                            <Ellipsis />
                        </div>
                    </>
                )}
                {pages.map((val) => (
                    <Button
                        key={val}
                        size={'icon'}
                        onClick={() => moveToPage(val)}
                        className={page === val ? 'hover:cursor-default hover:bg-background' : ''}
                        variant={page === val ? 'outline' : 'default'}>
                        {val}
                    </Button>
                ))}
            </div>
            <Button
                size={'icon'}
                variant={'ghost'}
                onClick={() => move('next')}
                disabled={page === lastVisiblePage}>
                <ChevronRight />
            </Button>
        </>
    );
}
