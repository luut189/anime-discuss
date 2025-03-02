import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    username: string;
    password: string;
    image: string;
    pinnedAnime: string[];
    threads: mongoose.Types.ObjectId[];
}

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
    pinnedAnime: [
        {
            type: String,
            default: [],
        },
    ],
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
