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

export const PORT = process.env.PORT;
export const SERVICE_URI = process.env.SERVICE_URI;
