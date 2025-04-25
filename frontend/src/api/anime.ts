import { AnimeDataResponse, JikanAnimeData, JikanData } from '@/common/interfaces';
import { delay } from '@/lib/utils';

const JIKAN_URI = 'https://api.jikan.moe/v4';

async function fetchFromAPI<T>(
    endpoint: string,
    retries = 3,
    delayMs = 500,
): Promise<T | undefined> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            return (await response.json()) as T;
        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);
            if (attempt < retries) {
                await delay(delayMs);
            } else {
                console.error(`All ${retries} attempts failed.`);
            }
        }
    }
}

export const fetchTodayAnimeData = () => fetchFromAPI<JikanAnimeData[]>('/api/anime/today');

export const fetchTopAnimeData = (page = 1, limit = 25) =>
    fetchFromAPI<JikanData>(`${JIKAN_URI}/top/anime?page=${page}&limit=${limit}`);

export const fetchAnimeById = (id: string) =>
    fetchFromAPI<AnimeDataResponse>(`${JIKAN_URI}/anime/${id}/full`).then((res) => res?.data);

export const searchAnimeByText = (text: string, limit = 25, page = 1) =>
    fetchFromAPI<JikanData>(
        `${JIKAN_URI}/anime?limit=${limit}&q=${encodeURIComponent(text)}&page=${page}`,
    );
