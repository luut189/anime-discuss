import { getCurrentSeasonAnime } from '@/service/jikan';
import connectMongoDB from '@/config/db';
import Anime from './models/anime.model';

async function runTask() {
    await connectMongoDB();

    const animes = Array.from(
        new Map((await getCurrentSeasonAnime()).map((anime) => [anime.mal_id, anime])).values(),
    );

    await Anime.deleteMany({});

    animes.forEach(async (anime) => {
        await Anime.create(anime);
        console.log(`Adding ${anime.title}`);
    });
}

runTask().catch(console.error);
