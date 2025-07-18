import connectMongoDB from '@/config/db';
import { getAnimeById, getCurrentSeasonAnime } from '@/service/jikan';
import { Anime, SeasonalAnime } from '@/models/anime.model';
import User from '@/models/user.model';
import logger from '@/common/logger';

import mongoose from 'mongoose';

async function runTask() {
    await connectMongoDB();

    const animes = Array.from(
        new Map((await getCurrentSeasonAnime()).map((anime) => [anime.mal_id, anime])).values(),
    );

    await SeasonalAnime.deleteMany({});

    for (const anime of animes) {
        await SeasonalAnime.create(anime);
        await Anime.findOneAndUpdate({ mal_id: anime.mal_id }, anime, { upsert: true });
        logger.info(`Updating ${anime.title}`);
    }

    const users = await User.find({});
    const animeIdToUpdate = new Set<string>();
    for (const user of users) {
        const animeIds = user.pinnedAnime.map((anime) => anime.animeId);
        animeIds.forEach((id) => animeIdToUpdate.add(id));
    }

    for (const id of animeIdToUpdate) {
        const anime = await getAnimeById(id);
        logger.info(`Updating ${id}`);
        await Anime.findOneAndUpdate({ mal_id: id }, anime, { upsert: true });
    }
}

runTask()
    .then(() => {
        return mongoose.disconnect();
    })
    .then(() => {
        logger.info('Finished');
        process.exit(0);
    })
    .catch((err) => {
        logger.error(err);
        process.exit(1);
    });
