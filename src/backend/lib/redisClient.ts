import { createClient, RedisClientType } from 'redis';
import { logger } from './logger';

let redisClient: RedisClientType | null = null;

/**
 * Singleton Redis connection manager built for high-throughput, loss-tolerant caching.
 */
export const getRedisClient = async (): Promise<RedisClientType> => {
    if (redisClient && redisClient.isReady) {
        return redisClient;
    }

    redisClient = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: {
            // Reconnection strategy: Exponential backoff with a cap of 5 seconds
            reconnectStrategy: (retries: number) => {
                if (retries > 20) {
                    logger.error('[Redis] Max reconnection attempts reached. Failing fast.');
                    return new Error('Redis Max Retries Exceeded');
                }
                const waitTime = Math.min(retries * 500, 5000); // 500ms, 1s, 1.5s ... max 5s
                logger.warn(`[Redis] Reconnecting... Attempt ${retries}. Waiting ${waitTime}ms`);
                return waitTime;
            },
            connectTimeout: 5000 // Give up quickly if cache is down, fallback to DB
        }
    });

    redisClient.on('error', (err) => logger.error('[Redis Core Error]', { error: err.message }));
    redisClient.on('connect', () => logger.info('[Redis] Connection Established.'));
    redisClient.on('ready', () => logger.info('[Redis] Cluster Ready for commands.'));

    try {
        await redisClient.connect();
    } catch (err) {
        logger.error('[Redis] Initial connection failed. Service will operate in degraded state.', { err });
    }

    return redisClient as RedisClientType;
};
