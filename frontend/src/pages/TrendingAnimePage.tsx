import { fetchTrendingAnimeData } from '@/common/query';
import { REFRESH_INTERVAL } from '@/common/constants';
import AnimePage from '@/pages/common/AnimePage';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useSearchParams } from 'react-router';

export default function TrendingAnimePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(Number(searchParams.get('page') || '1'));

    const { isError, isPending, data } = useQuery({
        queryKey: ['trending-anime', page],
        queryFn: () => fetchTrendingAnimeData(page),
        refetchInterval: REFRESH_INTERVAL,
        retry: 5,
    });

    return (
        <AnimePage
            title='Trending Anime'
            isError={isError}
            isPending={isPending}
            data={data}
            page={page}
            setPage={setPage}
            setSearchParams={setSearchParams}
        />
    );
}
