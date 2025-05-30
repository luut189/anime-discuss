import { IThread, IUser, JikanAnimeData } from '@/common/interfaces';

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

export async function getUserProfile(id: string) {
    try {
        const response = await fetch(`/api/user/${id}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }

        const data: IUser = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function getUserThreads(id: string) {
    try {
        const response = await fetch(`/api/user/threads/${id}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch threads: ${response.statusText}`);
        }

        const data: IThread[] = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function getPinnedAnime(id: string) {
    try {
        const response = await fetch(`/api/user/pinnedAnime/${id}`);
        if (!response.ok) throw new Error('Failed to fetch pinned anime');

        const data = (await response.json()) as JikanAnimeData[];

        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function updateWatchedEpisode(mal_id: number, ep: number, watched: boolean) {
    try {
        const response = await fetch(`/api/user/pinnedAnime/${mal_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ episode: ep, watched }),
        });

        if (!response.ok) throw new Error('Failed to update watched anime');

        return await response.json();
    } catch (error) {
        console.log(error);
    }
}
