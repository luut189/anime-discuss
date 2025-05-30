import { JikanAnimeData } from '@/common/interfaces';
import { AnimeCardSkeleton, AnimeCard } from '@/components/anime/AnimeCard';

interface AnimeCardGridProps {
    page?: number;
    isPendingData: boolean;
    items: JikanAnimeData[] | null[];
}

export default function AnimeCardGrid({ page, isPendingData, items }: AnimeCardGridProps) {
    return (
        <div className='mb-3 grid w-full grid-cols-2 gap-4 px-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7'>
            {items.map((anime, idx) => (
                <div
                    key={`page-${page}-${idx}`}
                    className='flex flex-col gap-2 justify-self-center'>
                    {isPendingData ? (
                        <AnimeCardSkeleton />
                    ) : (
                        <AnimeCard {...(anime as JikanAnimeData)} />
                    )}
                </div>
            ))}
        </div>
    );
}
