import { JikanAnimeData } from '@/common/interfaces';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { useNavigate } from 'react-router';

interface SearchResultProp {
    isError: boolean;
    isPending: boolean;
    data: JikanAnimeData[];
}

export default function SearchResult({ isError, isPending, data }: SearchResultProp) {
    const navigate = useNavigate();
    if (isPending) {
        return (
            <Card className='p-4'>
                <Skeleton className='mb-2 h-[20px] w-[100px] rounded-full' />
                <Skeleton className='mb-2 h-[20px] w-full rounded-full' />
                <Skeleton className='mb-2 h-[20px] w-full rounded-full' />
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className='p-4'>
                <div>There was an error, please try again!</div>
            </Card>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Card className='p-4'>
                <div>No results found.</div>
            </Card>
        );
    }

    return (
        <Card className='p-4'>
            <h2 className='text-lg font-semibold'>Search Results</h2>
            <ul className='space-y-2'>
                {data.map((anime) => (
                    <li
                        key={anime.mal_id}
                        className='flex w-full cursor-pointer flex-col rounded border-b p-2 transition-all last:border-b-0 last:pb-0 hover:border'
                        onClick={() => {
                            navigate(`/anime/${anime.mal_id}`);
                        }}>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className='line-clamp-2 break-words text-start font-bold'>
                                        {anime.title || 'Untitled'}
                                    </div>
                                    <div className='line-clamp-2 break-words text-start text-sm'>
                                        {anime.title_japanese || 'Unknown Japanese Title'}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{anime.title}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </li>
                ))}
            </ul>
        </Card>
    );
}
