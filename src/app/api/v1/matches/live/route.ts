import { NextResponse } from 'next';
import { createClient } from 'redis';
import { prisma } from '@/backend/lib/prisma';

let redisClient: ReturnType<typeof createClient>;

async function getRedis() {
  if (!redisClient) {
    redisClient = createClient({ url: process.env.REDIS_URL });
    await redisClient.connect();
  }
  return redisClient;
}

export const revalidate = 10; // Next.js ISR cache directive (s-maxage=10)

/**
 * GET /api/v1/matches/live
 * 
 * Deep Dive 4: High Frequency Endpoint.
 * Bypasses PostgreSQL entirely by hitting the Redis cache written by the LiveSyncWorker.
 */
export async function GET() {
  try {
    const redis = await getRedis();
    
    // We fetch all keys matching our live match prefix
    const keys = await redis.keys('agoro:matches:live:*');
    
    if (keys.length === 0) {
        // Fallback to database if Redis is totally empty (e.g. after a restart before the worker fires)
        const dbMatches = await prisma.fixture.findMany({
            where: { status: { in: ['LIVE', 'HT', 'PEN_LIVE'] } },
            orderBy: { starting_at: 'asc' }
        });
        
        return NextResponse.json({ success: true, data: dbMatches, source: 'postgres' }, {
            headers: {
                'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=15',
            }
        });
    }

    // Pipeline fetch all live match payloads from Redis
    const payloads = await Promise.all(keys.map(key => redis.get(key)));
    const liveMatches = payloads.filter(Boolean).map(jsonStr => JSON.parse(jsonStr as string));

    return NextResponse.json({ success: true, data: liveMatches, source: 'redis' }, {
        headers: {
            'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=15',
        }
    });

  } catch (error) {
    console.error('[API] /matches/live error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
