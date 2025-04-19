import mongoose, { Schema } from 'mongoose';

const EntityRefSchema = new Schema(
    {
        mal_id: Number,
        type: String,
        name: String,
        url: String,
    },
    { _id: false },
);

const AnimeSchema = new Schema({
    mal_id: { type: Number, required: true, unique: true },
    url: String,
    images: {
        jpg: {
            image_url: String,
            small_image_url: String,
            large_image_url: String,
        },
        webp: {
            image_url: String,
            small_image_url: String,
            large_image_url: String,
        },
    },
    trailer: {
        youtube_id: String,
        url: String,
        embed_url: String,
    },
    approved: Boolean,
    titles: [
        {
            type: {
                type: String,
            },
            title: String,
        },
    ],
    title: String,
    title_english: String,
    title_japanese: String,
    title_synonyms: [String],
    type: String,
    source: String,
    episodes: Number,
    status: String,
    airing: Boolean,
    aired: {
        from: String,
        to: String,
        prop: {
            from: {
                day: Number,
                month: Number,
                year: Number,
            },
            to: {
                day: Number,
                month: Number,
                year: Number,
            },
            string: String,
        },
    },
    duration: String,
    rating: String,
    score: Number,
    scored_by: Number,
    rank: Number,
    popularity: Number,
    members: Number,
    favorites: Number,
    synopsis: String,
    background: String,
    season: String,
    year: Number,
    broadcast: {
        day: String,
        time: String,
        timezone: String,
        string: String,
    },
    producers: [EntityRefSchema],
    licensors: [EntityRefSchema],
    studios: [EntityRefSchema],
    genres: [EntityRefSchema],
    explicit_genres: [EntityRefSchema],
    themes: [EntityRefSchema],
    demographics: [EntityRefSchema],

    cachedAt: { type: Date, default: Date.now },
});

const Anime = mongoose.model<typeof AnimeSchema>('Anime', AnimeSchema);

export default Anime;
