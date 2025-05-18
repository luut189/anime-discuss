import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

function usePagination() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(Number(searchParams.get('page') || '1'));

    useEffect(() => {
        const pageInUrl = Number(searchParams.get('page') || '1');
        if (pageInUrl !== page) {
            setPage(pageInUrl);
        }
    }, [searchParams, page]);

    function nextPage() {
        const newPage = page + 1;
        setSearchParams((prev) => {
            prev.set('page', `${newPage}`);
            return prev;
        });
        setPage(newPage);
    }

    function previousPage() {
        const newPage = Math.max(1, page - 1);
        setSearchParams((prev) => {
            prev.set('page', `${newPage}`);
            return prev;
        });
        setPage(newPage);
    }

    function move(direction: 'next' | 'prev') {
        if (direction === 'next') {
            nextPage();
        } else {
            previousPage();
        }
    }

    function moveToPage(page: number) {
        setSearchParams((prev) => {
            prev.set('page', `${page}`);
            return prev;
        });
        setPage(page);
    }

    return { page, move, moveToPage };
}

export default usePagination;
