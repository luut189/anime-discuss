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

export const ENV = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI!,
    NOV_ENV: process.env.NODE_ENV,
};
