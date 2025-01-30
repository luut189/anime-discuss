import { JikanAnimeData, JikanPaginationData } from '@/common/interfaces';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { useQuery } from '@tanstack/react-query';

interface JikanData {
    data: JikanAnimeData[];
    pagination: JikanPaginationData;
}

const refetchIntervalMs = 1000 * 60;

export default function TodayAnimeDisplay() {
    const { isPending, data } = useQuery({
        queryKey: ['today-anime'],
        queryFn: fetchTodayAnimeData,
        refetchInterval: refetchIntervalMs,
    });

    return (
        <div className='flex w-full flex-col items-center justify-center p-2'>
            <h1 className='mb-2 text-xl font-bold'>Today Anime</h1>
            <div className='flex w-fit flex-row flex-wrap items-center justify-center gap-2 rounded-sm border bg-slate-200 p-8'>
                {isPending
                    ? Array.from({ length: 3 }).map((_, index) => (
                          <Card key={index} className='flex h-96 w-64 flex-col justify-between p-4'>
                              <CardHeader>
                                  <Skeleton className='h-5 w-3/4' />
                              </CardHeader>
                              <CardContent className='flex items-center justify-center'>
                                  <Skeleton className='h-64 w-full rounded-md' />
                              </CardContent>
                          </Card>
                      ))
                    : data?.data.map((anime, index) => (
                          <Card
                              key={index}
                              className='flex h-96 w-64 flex-col justify-between p-4 transition-all hover:bg-gray-100'>
                              <CardHeader>
                                  <CardTitle className='break-words text-center text-lg font-semibold'>
                                      {anime.title || 'Untitled'}
                                  </CardTitle>
                              </CardHeader>
                              <CardContent className='flex items-center justify-center'>
                                  <img
                                      src={anime.images.jpg.large_image_url}
                                      alt={anime.title_english || 'Anime Image'}
                                      className='w-full rounded-md object-cover'
                                  />
                              </CardContent>
                          </Card>
                      ))}
            </div>
        </div>
    );
}

async function fetchTodayAnimeData() {
    try {
        const response = await fetch('/api/anime/today');
        if (!response.ok) {
            throw new Error();
        }
        const data: JikanData = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}
