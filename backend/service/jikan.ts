import { WEEKDAYS } from '@/common/constants';
import { JikanAnimeData, JikanPaginationData } from '@/common/interfaces';
import { delay } from '@/common/utils';

interface JikanSeasonResponse {
    data: JikanAnimeData[];
    pagination: JikanPaginationData;
}

const JIKAN_URI = 'https://api.jikan.moe/v4';
const REQUEST_DELAY = 350;
const MAX_RETRIES = 3;

const cache = new Map<string, { data: JikanSeasonResponse; timestamp: number }>();
const CACHE_TTL = 300_000; // 5 minutes

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<JikanSeasonResponse> {
    try {
        // Check cache first
        const cached = cache.get(url);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return cached.data;
        }

        const response = await fetch(url);

        if (response.status === 429) {
            const retryAfter = Number(response.headers.get('Retry-After') || 1) * REQUEST_DELAY;

            if (retries > 0) {
                await delay(retryAfter);
                return fetchWithRetry(url, retries - 1);
            }
            throw new Error('Rate limit exceeded after retries');
        }

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        cache.set(url, { data, timestamp: Date.now() });
        return data;
    } catch (error) {
        if (retries > 0) {
            return fetchWithRetry(url, retries - 1);
        }
        throw error;
    }
}

async function getCurrentSeasonAnime(): Promise<JikanAnimeData[]> {
    let page = 1;
    const results: JikanAnimeData[] = [];

    while (true) {
        try {
            const { data, pagination } = (await fetchWithRetry(
                `${JIKAN_URI}/seasons/now?page=${page}`,
            )) as JikanSeasonResponse;

            results.push(...data);
            if (!pagination.has_next_page) break;
            page++;
        } catch (error) {
            console.error('Failed to fetch season data:', error);
            break;
        }
    }

    return results;
}

async function getTrendingAnimeData(page: string): Promise<JikanSeasonResponse | undefined> {
    try {
        return await fetchWithRetry(`${JIKAN_URI}/top/anime?page=${page}`);
    } catch (error) {
        console.error('Failed to fetch trending anime:', error);
    }
}

function filterAnimeData(data: JikanAnimeData[], today: string): JikanSeasonResponse {
    const perPage = 5;

    const filteredAnimeData: JikanAnimeData[] = [];
    const seenId = new Set<number>();
    let itemCount = 0;
    let totalCount = 0;

    data.forEach((anime) => {
        const broadcastDay = anime.broadcast.day;

        // since the response is plural, we slice the 's' away
        if (broadcastDay && broadcastDay.slice(0, -1) === today) {
            if (!seenId.has(anime.mal_id)) {
                seenId.add(anime.mal_id);
                filteredAnimeData.push(anime);
                if (itemCount < perPage) itemCount++;
                totalCount++;
            }
        }
    });

    const lastVisiblePage = Math.ceil(totalCount / perPage);

    return {
        data: filteredAnimeData,
        pagination: {
            last_visible_page: lastVisiblePage,
            has_next_page: lastVisiblePage > 1,
            items: {
                count: itemCount,
                total: totalCount,
                per_page: perPage,
            },
        },
    };
}

async function getTodayAnimeData() {
    const date = new Date();
    const today = WEEKDAYS[date.getDay()];

    try {
        const currentSeasonAnime = await getCurrentSeasonAnime();
        if (currentSeasonAnime) {
            return filterAnimeData(currentSeasonAnime, today);
        }
    } catch (error) {
        console.error(error);
    }
}

export { getTodayAnimeData, getTrendingAnimeData };
