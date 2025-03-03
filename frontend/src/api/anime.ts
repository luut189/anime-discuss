import { AnimeDataResponse, JikanData } from '@/common/interfaces';

const JIKAN_URI = 'https://api.jikan.moe/v4';

async function fetchFromAPI<T>(endpoint: string): Promise<T | undefined> {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        return (await response.json()) as T;
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

export const fetchTodayAnimeData = () => fetchFromAPI<JikanData>('/api/anime/today');

export const fetchTrendingAnimeData = (page = 1, limit = 25) =>
    fetchFromAPI<JikanData>(`${JIKAN_URI}/top/anime?page=${page}&limit=${limit}`);

export const fetchAnimeById = (id: string) =>
    fetchFromAPI<AnimeDataResponse>(`${JIKAN_URI}/anime/${id}/full`).then((res) => res?.data);

export const searchAnimeByText = (text: string, limit = 25, page = 1) =>
    fetchFromAPI<JikanData>(
        `${JIKAN_URI}/anime?limit=${limit}&q=${encodeURIComponent(text)}&page=${page}`,
    );
