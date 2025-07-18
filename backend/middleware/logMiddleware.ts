import logger from '@/common/logger';
import { NextFunction, Request, Response } from 'express';

function logMiddleware(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, query, params, ip } = req;
    const startTime = process.hrtime();

    logger.info(`[REQUEST] ${method} ${originalUrl} - IP: ${ip}`);
    logger.debug(`[REQUEST BODY] ${JSON.stringify(body)}`);
    logger.debug(`[REQUEST QUERY] ${JSON.stringify(query)}`);
    logger.debug(`[REQUEST PARAMS] ${JSON.stringify(params)}`);

    const originalSend = res.send.bind(res);
    let responseBody: unknown;

    res.send = (body: unknown): Response => {
        responseBody = body;
        return originalSend(body);
    };

    res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(startTime);
        const duration = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);

        logger.info(`[RESPONSE] ${method} ${originalUrl} ${res.statusCode} - ${duration}ms`);
        logger.debug(
            `[RESPONSE BODY]\n${typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody)}`,
        );
    });

    next();
}

export { logMiddleware };
