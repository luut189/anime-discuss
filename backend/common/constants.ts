import { configDotenv } from 'dotenv';

configDotenv();

export const WEEKDAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

export const PROFILE_PICS = ['/avatar1.png', '/avatar2.png', '/avatar3.png'];

export const ENV = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI!,
    JWT_SECRET: process.env.JWT_SECRET!,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
    NODE_ENV: process.env.NODE_ENV,
};
