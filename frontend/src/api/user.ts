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
    try {
        const response = await fetch('/api/user/pinnedAnime');

        if (!response.ok) {
            throw new Error(`Failed to fetch threads: ${response.statusText}`);
        }

        const list: string[] = (await response.json()).pinnedAnime;

        const animeData: JikanAnimeData[] = (
            await Promise.all(
                list.map(async (mal_id) => {
                    await delay(100);
                    return await fetchAnimeById(mal_id);
                }),
            )
        ).filter((anime) => anime !== undefined);

        return animeData;
    } catch (error) {
        console.log(error);
    }
}
