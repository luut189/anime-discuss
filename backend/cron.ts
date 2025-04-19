import { getCurrentSeasonAnime } from '@/service/jikan';
import connectMongoDB from '@/config/db';
import Anime from './models/anime.model';
import mongoose from 'mongoose';

async function runTask() {
    await connectMongoDB();

    const animes = Array.from(
        new Map((await getCurrentSeasonAnime()).map((anime) => [anime.mal_id, anime])).values(),
    );

    await Anime.deleteMany({});

    for (const anime of animes) {
        await Anime.create(anime);
        console.log(`Adding ${anime.title}`);
    }
}

runTask()
    .then(() => {
        return mongoose.disconnect();
    })
    .then(() => {
        console.log('Finished');
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
