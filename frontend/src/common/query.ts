import { JikanAnimeData, JikanPaginationData } from '@/common/interfaces';

interface JikanData {
    data: JikanAnimeData[];
    pagination: JikanPaginationData;
}

export async function fetchTodayAnimeData() {
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

export async function fetchTrendingAnimeData(page = 1, limit = 25) {
    try {
        const response = await fetch(`/api/anime/trending?page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error();
        }
        const data: JikanData = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}
