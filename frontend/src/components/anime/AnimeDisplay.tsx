import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { fetchAnimeByDay, fetchTopAnimeData } from '@/api/anime';
import { WEEKDAYS } from '@/common/constants';
import AnimeCardGrid from '@/components/anime/AnimeCardGrid';
import ErrorFallback from '@/components/common/ErrorFallback';
import useBreakpoint from '@/hooks/useBreakpoint';
import { Day } from '@/common/interfaces';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

function getMaxItems(breakpoint: string) {
    switch (breakpoint) {
        case '2xl':
            return 7;
        case 'xl':
            return 6;
        case 'lg':
            return 6;
        case 'md':
            return 4;
        case 'sm':
            return 3;
        case 'base':
            return 2;
        default:
            return 2;
    }
}

function AnimeByDayDisplay() {
    const breakpoint = useBreakpoint();
    const maxItems = getMaxItems(breakpoint);
    const [day, setDay] = useState<Day | null>(null);
    const [showAll, setShowAll] = useState(false);
    const handleDayChange = (val: Day | null) => setDay(val);

    const { isError, isPending, data } = useQuery({
        queryKey: ['anime', day ?? 'today'],
        queryFn: () => fetchAnimeByDay(day),
    });

    function getItems() {
        if (isPending || !data) return Array.from({ length: maxItems }).map(() => null);

        if (data.length > maxItems && !showAll) return data.slice(0, maxItems);

        return data;
    }

    return (
        <>
            <div className='mb-2 flex w-full'>
                <div className='mr-auto text-xl font-bold'>{day ? day : 'Today'} Anime</div>
                <DropdownMenu>
                    <DropdownMenuTrigger title='Change broadcast day' asChild>
                        <Button variant={'ghost'} className='group'>
                            {day ? day : 'Today'}
                            <ChevronDown className='transition-transform group-data-[state=open]:rotate-180' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem
                            className={clsx(
                                !day &&
                                    'bg-emerald-700 text-primary-foreground dark:bg-emerald-400',
                            )}
                            onClick={() => handleDayChange(null)}>
                            Today
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {WEEKDAYS.filter((val) => val !== WEEKDAYS[new Date().getDay()]).map(
                            (val) => (
                                <DropdownMenuItem
                                    key={val}
                                    className={clsx(
                                        val === day &&
                                            'bg-emerald-700 text-primary-foreground dark:bg-emerald-400',
                                    )}
                                    onClick={() => handleDayChange(val)}>
                                    {val}
                                </DropdownMenuItem>
                            ),
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
                {data && data.length > maxItems ? (
                    <Button
                        variant={'link'}
                        className='flex items-center justify-center text-muted-foreground transition-colors hover:text-primary'
                        onClick={() => {
                            setShowAll(!showAll);
                        }}>
                        {showAll ? 'Show Less' : 'Show All'}
                    </Button>
                ) : null}
            </div>
            {isError ? (
                <ErrorFallback errorMessage={`Error Fetching ${day ? day : 'Today'} Anime`} />
            ) : (
                <AnimeCardGrid isPendingData={isPending} items={getItems()} />
            )}
        </>
    );
}

function TopAnimeDisplay() {
    const breakpoint = useBreakpoint();
    const maxItems = getMaxItems(breakpoint);
    const { isError, isPending, data } = useQuery({
        queryKey: ['trending-anime', 0],
        queryFn: () => fetchTopAnimeData(1, maxItems),
    });

    return (
        <>
            <div className='mb-2 flex w-full'>
                <div className='mr-auto text-xl font-bold'>Top Anime</div>
                <a href='/anime/top'>
                    <Button
                        variant={'link'}
                        className='flex items-center justify-center text-muted-foreground transition-colors hover:text-primary'>
                        Show All
                    </Button>
                </a>
            </div>
            {isError ? (
                <ErrorFallback errorMessage='Error Fetching Trending Anime' />
            ) : (
                <AnimeCardGrid
                    isPendingData={isPending}
                    items={
                        data
                            ? data.data.slice(0, maxItems)
                            : Array.from({ length: maxItems }).map(() => null)
                    }
                />
            )}
        </>
    );
}

export { AnimeByDayDisplay, TopAnimeDisplay };
