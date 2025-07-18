import { ENV } from '@/common/constants';
import logger from '@/common/logger';
import mongoose from 'mongoose';

async function connectMongoDB() {
    try {
        await mongoose.connect(ENV.MONGO_URI);

        logger.info('MongoDB connected');
    } catch (error) {
        logger.error(`Error connecting with MongoDB: ${error}`);
        process.exit(1);
    }
}

export default connectMongoDB;
