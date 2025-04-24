import { searchAnimeByText } from '@/api/anime';
import { REFRESH_INTERVAL } from '@/common/constants';
import ErrorFallback from '@/components/common/ErrorFallback';
import usePagination from '@/hooks/usePagination';
import AnimePage from '@/pages/common/AnimePage';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';

export default function SearchResultPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const decodedQuery = query ? decodeURIComponent(query) : '';
    const { page, move, moveToPage } = usePagination();

    const { isError, isPending, data } = useQuery({
        queryKey: ['search-result', decodedQuery, page],
        enabled: !!query,
        queryFn: () => searchAnimeByText(decodedQuery, 25, page),
        refetchInterval: REFRESH_INTERVAL,
        retry: 5,
    });

    if (!query) {
        return <ErrorFallback errorMessage='There is nothing to search for...' />;
    }

    return (
        <AnimePage
            title={`Search Results for "${decodedQuery}"`}
            isError={isError}
            isPending={isPending}
            data={data}
            page={page}
            move={move}
            moveToPage={moveToPage}
        />
    );
}
