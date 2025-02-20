import type React from 'react';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Input } from '@/components/ui/input';
import { searchAnimeByText } from '@/common/query';
import { REFRESH_INTERVAL } from '@/common/constants';
import { JikanAnimeData } from '@/common/interfaces';
import { useLocation } from 'react-router';
import SearchResult from '@/components/search/SearchResult';

export default function SearchBar() {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    const [showResult, setShowResult] = useState(true);

    const { isError, isPending, data } = useQuery({
        queryKey: ['search-result', debouncedQuery],
        queryFn: () => searchAnimeByText(debouncedQuery),
        refetchInterval: REFRESH_INTERVAL,
        retry: 5,
        enabled: debouncedQuery.length > 0,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // clear search query when changing location
    useEffect(() => {
        setSearchQuery('');
        setDebouncedQuery('');
    }, [location]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setSearchQuery(e.target.value);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log(searchQuery);
    }

    return (
        <div className='flex w-1/2 flex-col gap-2'>
            <form className='flex items-center justify-center' onSubmit={handleSubmit}>
                <Input
                    type='text'
                    placeholder='Search...'
                    value={searchQuery}
                    onChange={handleChange}
                    onBlur={() => {
                        setShowResult(true);
                    }}
                    onFocus={() => {
                        setShowResult(true);
                    }}
                    className='flex-grow'
                />
            </form>
            <div className='relative'>
                {showResult && debouncedQuery.length > 0 && (
                    <div className='absolute z-10 w-full'>
                        <SearchResult
                            isError={isError}
                            isPending={isPending}
                            data={data as JikanAnimeData[]}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
