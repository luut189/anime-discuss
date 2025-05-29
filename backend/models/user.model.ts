import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    username: string;
    password: string;
    image: string;
    pinnedAnime: { animeId: string; watchedEpisodes: number[] }[];
    threads: mongoose.Types.ObjectId[];
}

interface IPinnedAnime {
    animeId: string;
    watchedEpisodes: number[];
}

const PinnedAnimeSchema = new Schema<IPinnedAnime>(
    {
        animeId: {
            type: String,
            required: true,
        },
        watchedEpisodes: {
            type: [Number],
            default: [],
        },
    },
    { _id: false },
);

const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: '',
    },
    pinnedAnime: [PinnedAnimeSchema],
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread',
            default: [],
        },
    ],
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
export { IUser };
