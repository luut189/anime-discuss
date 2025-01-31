import { WEEKDAYS } from '@/common/constants';
import { JikanAnimeData, JikanPaginationData } from '@/common/interfaces';
import { delay } from '@/common/utils';

interface JikanSeasonResponse {
    data: JikanAnimeData[];
    pagination: JikanPaginationData;
}

const JIKAN_URI = 'https://api.jikan.moe/v4';
const REQUEST_DELAY = 500;

async function getCurrentSeasonAnime() {
    let hasNextPage = true;
    let index = 1;
    const returnedData: JikanAnimeData[] = [];
    while (hasNextPage) {
        try {
            const response = await fetch(JIKAN_URI + `/seasons/now?page=${index}`);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const data: JikanSeasonResponse = await response.json();
            returnedData.push(...data.data);
            hasNextPage = data.pagination.has_next_page;
            index++;

            if (hasNextPage) await delay(REQUEST_DELAY);
        } catch (error) {
            console.error(error);
            continue;
        }
    }

    return returnedData;
}

async function getTrendingAnimeData(page: string) {
    try {
        const response = await fetch(JIKAN_URI + `/top/anime?page=${page}`);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data: JikanSeasonResponse = await response.json();
        return data;
    } catch (error) {
        console.error(error);
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
