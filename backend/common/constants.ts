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

export const ENV_VARS = {
    PORT: process.env.PORT,
};
