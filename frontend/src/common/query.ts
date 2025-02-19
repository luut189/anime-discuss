import { IThread, JikanAnimeData, JikanPaginationData } from '@/common/interfaces';

interface JikanData {
    data: JikanAnimeData[];
    pagination: JikanPaginationData;
}

interface AnimeDataResponse {
    data: JikanAnimeData;
}

const JIKAN_URI = 'https://api.jikan.moe/v4';

async function fetchTodayAnimeData() {
    try {
        const response = await fetch('/api/anime/today');
        if (!response.ok) {
            throw new Error();
        }
        const data: JikanData = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function fetchTrendingAnimeData(page = 1, limit = 25) {
    try {
        const response = await fetch(`${JIKAN_URI}/top/anime?page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error();
        }
        const data: JikanData = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function fetchAnimeById(id: string) {
    try {
        const response = await fetch(`${JIKAN_URI}/anime/${id}/full`);
        if (!response.ok) {
            throw new Error();
        }
        const data: AnimeDataResponse = await response.json();
        return data.data;
    } catch (error) {
        console.error(error);
    }
}

async function searchAnimeByText(text: string) {
    try {
        const response = await fetch(`${JIKAN_URI}/anime?limit=5&q=${encodeURIComponent(text)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error();
        }
        const data: JikanData = await response.json();

        return data.data;
    } catch (error) {
        console.error(error);
    }
}

async function fetchAnimeThreads() {
    try {
        const response = await fetch('/api/thread');
        if (!response.ok) {
            throw new Error();
        }
        const data: IThread = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

export {
    fetchTodayAnimeData,
    fetchTrendingAnimeData,
    fetchAnimeById,
    searchAnimeByText,
    fetchAnimeThreads,
};
