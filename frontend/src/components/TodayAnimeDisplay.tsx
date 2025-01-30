import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { AnimeCard, AnimeCardSkeleton } from '@/components/AnimeCard';
import { fetchTodayAnimeData } from '@/common/query';

const REFRESH_INTERVAL = 1000 * 60;
const MAX_ITEMS = 5;

export default function TodayAnimeDisplay() {
    const { isPending, data } = useQuery({
        queryKey: ['today-anime'],
        queryFn: fetchTodayAnimeData,
        refetchInterval: REFRESH_INTERVAL,
    });

    return (
        <>
            <div className='flex w-full flex-row p-3 px-4'>
                <div className='mb-2 mr-auto text-xl font-bold'>Today Anime</div>
                <Link
                    to={'/anime/today'}
                    className='text-md mb-2 ml-auto flex items-center justify-center text-muted-foreground transition-colors hover:text-primary'>
                    View All
                </Link>
            </div>
            <div className='mb-3 grid w-full max-w-7xl grid-flow-col gap-4 px-4'>
                {isPending
                    ? Array.from({ length: MAX_ITEMS }).map((_, index) => (
                          <div key={index} className='flex flex-col gap-2 justify-self-center'>
                              <AnimeCardSkeleton />
                          </div>
                      ))
                    : data?.data.slice(0, MAX_ITEMS).map((anime, index) => (
                          <div key={index} className='flex flex-col gap-2 justify-self-center'>
                              <AnimeCard animeData={anime} />
                          </div>
                      ))}
            </div>
        </>
    );
}
