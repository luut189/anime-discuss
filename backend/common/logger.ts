import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp(), errors({ stack: true }), logFormat),
    transports: [
        new transports.Console({ format: combine(colorize(), logFormat) }),
        new transports.File({ filename: 'logs/combined.log' }),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
    ],
    exceptionHandlers: [new transports.File({ filename: 'logs/exceptions.log' })],
    rejectionHandlers: [new transports.File({ filename: 'logs/rejections.log' })],
});

export default logger;
