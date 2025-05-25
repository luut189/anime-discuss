import { AnimeByDayDisplay, TopAnimeDisplay } from '@/components/anime/AnimeDisplay';
import LatestThreads from '@/components/thread/LatestThreads';

export default function Homepage() {
    return (
        <>
            <AnimeByDayDisplay />
            <TopAnimeDisplay />
            <LatestThreads />
        </>
    );
}
