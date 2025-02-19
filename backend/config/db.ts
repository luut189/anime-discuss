import { ENV } from '@/common/constants';
import mongoose from 'mongoose';

async function connectMongoDB() {
    try {
        const conn = await mongoose.connect(ENV.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error connecting with MongoDB: ${error}`);
        process.exit(1);
    }
}

export default connectMongoDB;
