import { useState } from 'react';
import { JikanAnimeData, JikanPaginationData } from '@/common/interfaces';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface JikanData {
    data: JikanAnimeData[];
    pagination: JikanPaginationData;
}

export default function App() {
    const [data, setData] = useState<JikanData>();
    const [page, setPage] = useState(0);
    async function handleClick() {
        try {
            const response = await fetch('http://localhost:5000/anime/today');
            if (!response.ok) {
                throw new Error();
            }
            const newData = await response.json();
            setData(newData);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='flex flex-col items-center justify-center gap-5 p-5'>
            <div className='flex items-center justify-center gap-5'>
                <Button
                    onClick={() => {
                        setPage(page == 0 ? 0 : page - 1);
                    }}
                    size={'icon'}>
                    <ChevronLeft />
                </Button>
                <Button variant={'outline'} disabled className='disabled:opacity-100'>
                    {page + 1} / {data?.pagination.last_visible_page}
                </Button>
                <Button
                    onClick={() => {
                        setPage(page + 1 == data?.pagination.last_visible_page ? 0 : page + 1);
                    }}
                    size={'icon'}>
                    <ChevronRight />
                </Button>
            </div>
            <Button variant={'outline'} onClick={handleClick}>
                Get Today Anime
            </Button>
            <div className='flex flex-row flex-wrap items-center justify-center gap-2'>
                {data?.data
                    .slice(
                        page * data.pagination.items.per_page,
                        (page + 1) * data.pagination.items.per_page,
                    )
                    .map((anime, index) => (
                        <Card
                            key={index}
                            className='flex flex-col justify-between p-4 w-full min-h-max max-w-xs hover:bg-gray-100 transition-all'>
                            <CardHeader>
                                <CardTitle className='break-words text-lg font-semibold text-center'>
                                    {anime.title || 'Untitled'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='flex justify-center items-center'>
                                <img
                                    src={anime.images.jpg.large_image_url}
                                    alt={anime.title_english || 'Anime Image'}
                                    className='w-full object-cover rounded-md'
                                />
                            </CardContent>
                        </Card>
                    ))}
            </div>
        </div>
    );
}
