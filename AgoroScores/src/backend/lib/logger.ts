import winston from 'winston';

// Use structured JSON logging in Production, readable CLI format in Dev
const format = process.env.NODE_ENV === 'production' 
    ? winston.format.combine(
        winston.format.timestamp(),
        winston.format.json() // Outputs {"level":"error","message":"...","timestamp":"..."} for Datadog
    )
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
            return `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
        })
    );

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format,
    defaultMeta: { service: 'agoroscores-core' },
    transports: [
        new winston.transports.Console()
        // In full prod, we could attach: new winston.transports.File({ filename: 'error.log', level: 'error' })
    ],
});

/**
 * Convenience wrapper for structured API error logging
 */
export const logApiError = (route: string, error: unknown, userId?: string) => {
    logger.error(`API Error in ${route}`, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        userId
    });
};
