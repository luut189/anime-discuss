import { TodayAnimeDisplay, TrendingAnimeDisplay } from '@/components/anime/AnimeDisplay';

export default function Homepage() {
    return (
        <>
            <TodayAnimeDisplay />
            <TrendingAnimeDisplay />
        </>
    );
}
