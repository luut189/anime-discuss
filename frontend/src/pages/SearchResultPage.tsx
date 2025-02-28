import { searchAnimeByText } from '@/common/query';
import { REFRESH_INTERVAL } from '@/common/constants';
import AnimePage from '@/pages/common/AnimePage';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useSearchParams } from 'react-router';

export default function SearchResultPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q');
    const decodedQuery = query ? decodeURIComponent(query) : '';
    const [page, setPage] = useState(Number(searchParams.get('page') || '1'));

    const { isError, isPending, data } = useQuery({
        queryKey: ['search-result', decodedQuery, page],
        enabled: !!query,
        queryFn: () => searchAnimeByText(decodedQuery, 25, page),
        refetchInterval: REFRESH_INTERVAL,
        retry: 5,
    });

    return (
        <AnimePage
            title={`Search Results for ${decodedQuery}`}
            isError={isError}
            isPending={isPending}
            data={data}
            page={page}
            setPage={setPage}
            setSearchParams={setSearchParams}
        />
    );
}
