import { TodayAnimeDisplay, TopAnimeDisplay } from '@/components/anime/AnimeDisplay';
import LatestThreads from '@/components/thread/LatestThreads';

export default function Homepage() {
    return (
        <>
            <TodayAnimeDisplay />
            <TopAnimeDisplay />
            <LatestThreads />
        </>
    );
}
