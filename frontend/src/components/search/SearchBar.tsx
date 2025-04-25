import { Input } from '@/components/ui/input';
import { searchAnimeByText } from '@/api/anime';
import { REFRESH_INTERVAL } from '@/common/constants';
import { JikanAnimeData } from '@/common/interfaces';
import SearchResult from '@/components/search/SearchResult';

import type React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useQuery } from '@tanstack/react-query';

export default function SearchBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    const [showResult, setShowResult] = useState(true);

    const { isError, isPending, data } = useQuery({
        queryKey: ['search-result', debouncedQuery, 1],
        queryFn: () => searchAnimeByText(debouncedQuery, 5, 1),
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

    useEffect(() => {
        setShowResult(false);
    }, [location]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setSearchQuery(e.target.value);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        navigate(`/anime/search?q=${searchQuery}`);
    }

    function handleBlur() {
        setShowResult(false);
    }

    function handleFocus() {
        setShowResult(true);
    }

    return (
        <div className='flex w-1/2 flex-col'>
            <form
                className='flex items-center justify-center'
                onSubmit={handleSubmit}
                onBlur={handleBlur}
                onFocus={handleFocus}>
                <Input
                    type='text'
                    placeholder='Search...'
                    value={searchQuery}
                    onChange={handleChange}
                    className='flex-grow'
                />
            </form>
            <div className='md:relative'>
                {showResult && debouncedQuery.length > 0 && (
                    <div
                        className='absolute left-0 z-10 mt-4 w-full px-2 md:left-auto md:px-0'
                        onMouseDown={(e) => e.preventDefault()}>
                        <SearchResult
                            isError={isError}
                            isPending={isPending}
                            data={data?.data as JikanAnimeData[]}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
