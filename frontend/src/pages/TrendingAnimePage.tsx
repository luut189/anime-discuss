import { fetchTrendingAnimeData } from '@/common/query';
import { REFRESH_INTERVAL } from '@/common/constants';
import AnimePage from '@/pages/common/AnimePage';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function TrendingAnimePage() {
    const [page, setPage] = useState(1);

    const { isError, isPending, data } = useQuery({
        queryKey: [`trending-anime-${page}`],
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
        />
    );
}
