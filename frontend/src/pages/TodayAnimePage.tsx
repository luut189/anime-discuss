import { fetchTodayAnimeData } from '@/common/query';
import { AnimeCard, AnimeCardSkeleton } from '@/components/AnimeCard';

import { useQuery } from '@tanstack/react-query';

const REFRESH_INTERVAL = 1000 * 60;
const PLACEHOLDER_ITEMS = 10;

export default function TodayAnimePage() {
    const { isPending, data } = useQuery({
        queryKey: ['today-anime'],
        queryFn: fetchTodayAnimeData,
        refetchInterval: REFRESH_INTERVAL,
    });

    return (
        <>
            <div className='flex w-full flex-row p-3 px-4'>
                <div className='mb-2 mr-auto text-xl font-bold'>Today Anime</div>
            </div>
            <div className='mb-3 grid w-full max-w-7xl grid-cols-2 gap-4 px-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7'>
                {isPending
                    ? Array.from({ length: PLACEHOLDER_ITEMS }).map((_, index) => (
                          <div key={index} className='flex flex-col gap-2 justify-self-center'>
                              <AnimeCardSkeleton />
                          </div>
                      ))
                    : data?.data.map((anime, index) => (
                          <div key={index} className='flex flex-col gap-2 justify-self-center'>
                              <AnimeCard animeData={anime} />
                          </div>
                      ))}
            </div>
        </>
    );
}
