import { SERVICE_URI, WEEKDAYS } from '@/common/constants';
import { AnimeData } from '@/common/interfaces';

interface SeasonResponse {
    data: AnimeData[];
    pagination: {
        last_visible_page: number;
        has_next_page: boolean;
        items: {
            count: number;
            total: number;
            per_page: number;
        };
    };
}

async function getCurrentSeasonAnime() {
    try {
        const response = await fetch(SERVICE_URI + '/seasons/now?continuing');
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data: SeasonResponse = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function getTrendingAnimeData() {
    try {
        const response = await fetch(SERVICE_URI + '/seasons/now?continuing');
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data: SeasonResponse = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

function filterAnimeData(response: SeasonResponse, today: string): SeasonResponse {
    const data = response.data;
    const perPage = 5;

    const filteredAnimeData: AnimeData[] = [];
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
