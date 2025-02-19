'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { searchAnimeByText } from '@/common/query';
import { REFRESH_INTERVAL } from '@/common/constants';
import { JikanAnimeData } from '@/common/interfaces';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router';

interface SearchResultProp {
    isPending: boolean;
    data: JikanAnimeData[];
}

export default function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

    const { isPending, data } = useQuery({
        queryKey: ['search-result', debouncedQuery],
        queryFn: () => searchAnimeByText(debouncedQuery),
        refetchInterval: REFRESH_INTERVAL,
        retry: 5,
        enabled: debouncedQuery.length > 0,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setSearchQuery(e.target.value);
    }

    return (
        <div className='flex w-1/2 flex-col gap-2'>
            <form className='flex items-center justify-center'>
                <Input
                    type='text'
                    placeholder='Search...'
                    value={searchQuery}
                    onChange={handleChange}
                    className='flex-grow'
                />
            </form>
            <div className='relative'>
                {debouncedQuery.length > 0 && (
                    <div className='absolute z-10 w-full'>
                        <SearchResult isPending={isPending} data={data as JikanAnimeData[]} />
                    </div>
                )}
            </div>
        </div>
    );
}

function SearchResult({ isPending, data }: SearchResultProp) {
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

    if (!data || data.length === 0) {
        return (
            <Card className='p-4'>
                <div>No results found.</div>
            </Card>
        );
    }

    return (
        <Card className='p-4'>
            <h2 className='mb-2 text-lg font-semibold'>Search Results</h2>
            <ul className='space-y-2'>
                {data.map((anime) => (
                    <li
                        key={anime.mal_id}
                        className='grid cursor-pointer grid-cols-2 rounded border-b p-2 transition-all last:border-b-0 last:pb-0 hover:border'
                        onClick={() => {
                            navigate(`/anime/${anime.mal_id}`);
                        }}>
                        <div>
                            <div className='font-bold'>{anime.title || 'Untitled'}</div>
                            <div className='text-sm'>
                                {anime.title_japanese || 'Unknown Japanese Title'}
                            </div>
                        </div>
                        <div className='flex flex-row justify-end gap-2 font-bold'>
                            {anime.score}
                            <Star color='#fef084' fill='#fef083' />
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
}
