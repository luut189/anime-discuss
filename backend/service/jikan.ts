import { WEEKDAYS } from '@/common/constants';
import { JikanAnimeData, JikanPaginationData } from '@/common/interfaces';

interface JikanSeasonResponse {
    data: JikanAnimeData[];
    pagination: JikanPaginationData;
}

const JIKAN_URI = 'https://api.jikan.moe/v4';

async function getCurrentSeasonAnime() {
    try {
        const response = await fetch(JIKAN_URI + '/seasons/now?continuing');
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data: JikanSeasonResponse = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function getTrendingAnimeData() {
    try {
        const response = await fetch(JIKAN_URI + '/seasons/now?continuing');
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data: JikanSeasonResponse = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

function filterAnimeData(response: JikanSeasonResponse, today: string): JikanSeasonResponse {
    const data = response.data;
    const perPage = 5;

    const filteredAnimeData: JikanAnimeData[] = [];
    let itemCount = 0;
    let totalCount = 0;

    data.forEach((anime) => {
        const broadcastDay = anime.broadcast.day;

        // since the response is plural, we slice the 's' away
        if (broadcastDay && broadcastDay.slice(0, -1) === today) {
            filteredAnimeData.push(anime);
            if (itemCount < perPage) itemCount++;
            totalCount++;
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
