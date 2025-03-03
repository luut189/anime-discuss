import { Input } from '@/components/ui/input';
import { searchAnimeByText } from '@/api/anime';
import { REFRESH_INTERVAL } from '@/common/constants';
import { JikanAnimeData } from '@/common/interfaces';
import SearchResult from '@/components/search/SearchResult';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';

export default function SearchBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    const [showResult, setShowResult] = useState(true);
    const blurTimeoutRef = useRef<NodeJS.Timeout>();

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
        navigate(`/anime/search?q=${searchQuery}`);
    }

    function handleBlur() {
        if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
        }

        blurTimeoutRef.current = setTimeout(() => {
            setShowResult(false);
        }, 300);
    }

    function handleFocus() {
        if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
        }
        setShowResult(true);
    }

    return (
        <div className='flex w-1/2 flex-col'>
            <form className='flex items-center justify-center' onSubmit={handleSubmit}>
                <Input
                    type='text'
                    placeholder='Search...'
                    value={searchQuery}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    className='flex-grow'
                />
            </form>
            <div className='relative'>
                {showResult && debouncedQuery.length > 0 && (
                    <div className='absolute z-10 mt-2 w-full'>
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
