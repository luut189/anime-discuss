import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    username: string;
    password: string;
    image: string;
    pinnedAnime: string[];
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
    pinnedAnime: {
        type: [String],
        default: [],
    },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
export { IUser };
