import { fetchTopAnimeData } from '@/api/anime';
import { REFRESH_INTERVAL } from '@/common/constants';
import usePagination from '@/hooks/usePagination';
import AnimePage from '@/pages/common/AnimePage';

import { useQuery } from '@tanstack/react-query';

export default function TopAnimePage() {
    const { page, move, moveToPage } = usePagination();

    const { isError, isPending, data } = useQuery({
        queryKey: ['trending-anime', page],
        queryFn: () => fetchTopAnimeData(page),
        refetchInterval: REFRESH_INTERVAL,
        retry: 5,
    });

    return (
        <AnimePage
            title='Top Anime'
            isError={isError}
            isPending={isPending}
            data={data}
            page={page}
            move={move}
            moveToPage={moveToPage}
        />
    );
}
