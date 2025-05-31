import { updateWatchedEpisode } from '@/api/user';
import { JikanAnimeData } from '@/common/interfaces';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/useAuthStore';

import { toast } from 'sonner';
import clsx from 'clsx';

export default function EpisodeTracker({ airing, mal_id, episodes }: JikanAnimeData) {
    const { user, setUser } = useAuthStore();
    const anime = user?.pinnedAnime.find((item) => item.animeId === String(mal_id));
    const watchedEpisodes = anime?.watchedEpisodes || [];

    const handleClick = async (ep: number, watched: boolean) => {
        if (!user) return;

        let minEp = Number.MAX_VALUE;
        let updatedEpisodes = [...watchedEpisodes];
        if (watched && !updatedEpisodes.includes(ep)) {
            for (let i = 1; i <= ep; i++) {
                if (!updatedEpisodes.includes(i)) {
                    minEp = Math.min(i, minEp);
                    updatedEpisodes.push(i);
                }
            }
        } else if (!watched) {
            updatedEpisodes = updatedEpisodes.filter((item) => item < ep);
        }

        const epWatched = minEp == ep ? String(ep) : `${minEp} to ${ep}`;

        const updatedAnime = {
            animeId: String(mal_id),
            watchedEpisodes: updatedEpisodes,
        };

        const newPinnedAnime = user.pinnedAnime.some((item) => item.animeId === String(mal_id))
            ? user.pinnedAnime.map((item) =>
                  item.animeId === String(mal_id) ? updatedAnime : item,
              )
            : [...user.pinnedAnime, updatedAnime];

        setUser({ ...user, pinnedAnime: newPinnedAnime });
        toast.success(`Episode ${watched ? `${epWatched} marked as watched` : `${ep} unmarked`}`);
        await updateWatchedEpisode(mal_id, ep, watched);
    };

    const renderEpisodeButtons = (count: number) =>
        Array.from({ length: count }, (_, i) => {
            const ep = i + 1;
            const watched = watchedEpisodes.includes(ep);

            return (
                <Button
                    key={ep}
                    onClick={() => handleClick(ep, !watched)}
                    size='icon'
                    variant={watched ? 'default' : 'destructive'}
                    className={clsx(
                        'rounded-full transition-colors',
                        watched && 'bg-emerald-500 text-white hover:bg-emerald-400',
                    )}>
                    {ep}
                </Button>
            );
        });

    const totalEpisodes = episodes
        ? episodes
        : airing
          ? Math.max(1, Math.max(0, ...watchedEpisodes) + 1)
          : 0;

    return (
        <div className='flex flex-col items-center gap-4 rounded-md border p-4'>
            <p className='text-center text-lg font-semibold'>Episodes Tracker</p>

            {anime ? (
                <div className='flex w-full flex-wrap justify-center gap-2 lg:w-2/3'>
                    {renderEpisodeButtons(totalEpisodes)}
                </div>
            ) : (
                <p className='text-center text-xl font-semibold text-red-400'>
                    Pin this anime to enable episode tracking
                </p>
            )}
        </div>
    );
}
