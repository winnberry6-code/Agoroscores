import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient>;

async function getRedis() {
  if (!redisClient) {
    redisClient = createClient({ url: process.env.REDIS_URL });
    await redisClient.connect();
  }
  return redisClient;
}

/**
 * performanceMonitoringService
 * 
 * Aggregates highly active ephemeral metrics from Redis and memory for the Admin Dashboard.
 * Crucial for managing the Scaling Strategy during 200+ match windows.
 */
export class PerformanceMonitoringService {

    /**
     * Grabs a snapshot of the current architectural health.
     */
    async getGlobalHealthSnapshot() {
        const redis = await getRedis();

        // 1. WebSocket Concurrency Counters (Incremented/decremented by socket handlers)
        const activeSockets = await redis.get('metrics:ws_active_connections') || '0';
        
        // 2. Queue Backlog 
        const dlqCount = await redis.get('metrics:dlq_count') || '0';
        const pendingSyncEvents = await redis.llen('queue:sportsmonks_ingest');

        // 3. Cache Effectiveness 
        // Note: Edge caching hit rates are typically pulled from Vercel/Cloudflare APIs.
        // Here we track internal Redis hit/miss ratios for the DB proxy tier.
        const hits = parseInt(await redis.get('metrics:redis_hits') || '0');
        const misses = parseInt(await redis.get('metrics:redis_misses') || '0');
        const cacheHitRate = (hits + misses) === 0 ? 0 : (hits / (hits + misses)) * 100;

        return {
            concurrent_users: parseInt(activeSockets),
            internal_cache_hit_rate: cacheHitRate.toFixed(1) + '%',
            message_queue_backlog: pendingSyncEvents,
            dead_letter_queue: parseInt(dlqCount),
            memory_usage_mb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
        };
    }

    /**
     * Identifies which competitions are lagging behind real-time.
     */
    async getDelayedCompetitions(staleThresholdMs: number = 60000) {
        const redis = await getRedis();
        const liveMatchKeys = await redis.keys('match_state:*');
        
        const laggingMatches = [];
        const now = Date.now();

        for (const key of liveMatchKeys) {
            const rawMatch = await redis.get(key);
            if (rawMatch) {
                const match = JSON.parse(rawMatch);
                // Deep latency check
                if (now - match.last_update_timestamp > staleThresholdMs) {
                    laggingMatches.push({
                        fixture_id: match.match_id,
                        league_id: match.competition_id,
                        lag_seconds: Math.floor((now - match.last_update_timestamp) / 1000)
                    });
                }
            }
        }

        // Distinct by league
        const laggingLeagues = new Set(laggingMatches.map(m => m.league_id));
        return {
            lagging_leagues_count: laggingLeagues.size,
            critical_fixtures: laggingMatches
        };
    }
}

export const performanceMonitor = new PerformanceMonitoringService();
