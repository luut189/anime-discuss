import { fetchAnimeById } from '@/api/anime';
import { IThread, JikanAnimeData } from '@/common/interfaces';
import { delay } from '@/lib/utils';

export async function pinAnime(mal_id: number) {
    const response = await fetch('/api/user/pinnedAnime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mal_id }),
    });

    if (!response.ok) throw new Error('Failed to pin anime');
}

export async function unpinAnime(mal_id: number) {
    const response = await fetch('/api/user/pinnedAnime', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mal_id }),
    });

    if (!response.ok) throw new Error('Failed to unpin anime');
}

export async function getUserThreads() {
    try {
        const response = await fetch('/api/user/threads');

        if (!response.ok) {
            throw new Error(`Failed to fetch threads: ${response.statusText}`);
        }

        const data: IThread[] = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function getPinnedAnime() {
    const RATE_LIMIT = 3;
    try {
        const response = await fetch('/api/user/pinnedAnime');
        if (!response.ok) throw new Error('Failed to fetch pinned anime');

        const pinnedAnime = (await response.json()).pinnedAnime as string[];
        if (!pinnedAnime.length) return [];

        const animeData: JikanAnimeData[] = [];

        for (let i = 0; i < pinnedAnime.length; i += RATE_LIMIT) {
            const batch = pinnedAnime.slice(i, i + RATE_LIMIT);

            const results = await Promise.allSettled(batch.map((mal_id) => fetchAnimeById(mal_id)));

            animeData.push(
                ...results
                    .filter((res) => res.status === 'fulfilled' && res.value)
                    .map((res) => (res as PromiseFulfilledResult<JikanAnimeData>).value),
            );

            if (i + RATE_LIMIT < pinnedAnime.length) {
                await delay(500);
            }
        }

        return animeData;
    } catch (error) {
        console.error(error);
        return [];
    }
}
