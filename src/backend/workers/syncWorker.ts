import { prisma } from '../lib/prisma';
import { SportsMonksClient } from './SportsMonksClient';
import crypto from 'crypto';
import { createClient } from 'redis';

const client = new SportsMonksClient();

// In-memory hash map to prevent DB load. Can be shifted to Redis for multi-node setups.
const fixtureHashCache = new Map<number, string>();

let redisPublisher: ReturnType<typeof createClient>;

async function initRedis() {
  if (!redisPublisher) {
    redisPublisher = createClient({ url: process.env.REDIS_URL });
    await redisPublisher.connect();
  }
}

/**
 * LiveSyncWorker (Daemon)
 * Deep Dive 3 implementation: Polls 10s, deduplicates via SHA-1 hashes, and pushes patches.
 */
export async function syncLiveMatches() {
  console.log('[LiveSyncWorker] Polling for Live updates...');
  await initRedis();

  try {
    const response = await client.getLatestUpdatedLiveScores(['events', 'scores', 'participants']);
    const matches = response.data;

    if (!matches || matches.length === 0) {
      console.log('[LiveSyncWorker] No active live matches.');
      return;
    }

    for (const match of matches) {
      const matchId = match.id;
      
      // Calculate delta hash purely on the events and scores array.
      // This is dramatically faster than comparing hundreds of fields in JS.
      const payloadString = JSON.stringify({
        events: match.events || [],
        scores: match.scores || [],
        state: match.state?.state,
        minute: match.minute
      });
      
      const currentHash = crypto.createHash('sha1').update(payloadString).digest('hex');
      const previousHash = fixtureHashCache.get(matchId);

      // Deduplication Matrix (Deep Dive 3 point 1.1)
      if (currentHash === previousHash) {
         continue; // Absolutely nothing changed for this match. Skip hitting Postgres.
      }

      console.log(`[LiveSyncWorker] Delta detected for Match ${matchId}. Upserting...`);
      fixtureHashCache.set(matchId, currentHash);

      const homeScoreObj = match.scores?.find((s: any) => s.description === 'CURRENT' && s.score?.participant === 'home');
      const awayScoreObj = match.scores?.find((s: any) => s.description === 'CURRENT' && s.score?.participant === 'away');

      // 1. Transactional Upsert for Match + Events avoiding duplicates
      await prisma.$transaction(async (tx) => {
        // Upsert Match Core
        const upsertedFixture = await tx.fixture.upsert({
          where: { external_id: matchId },
          update: {
            status: match.state?.state || 'LIVE',
            status_minute: match.minute,
            home_score: homeScoreObj ? homeScoreObj.score.goals : 0,
            away_score: awayScoreObj ? awayScoreObj.score.goals : 0,
            last_synced_at: new Date()
          },
          create: {
            external_id: matchId,
            league_id: match.league_id ? match.league_id.toString() : 'temp', // Real lookup needed
            home_team_id: 'temp',
            away_team_id: 'temp',
            starting_at: new Date(match.starting_at),
            status: match.state?.state || 'LIVE',
            status_minute: match.minute,
            home_score: homeScoreObj ? homeScoreObj.score.goals : 0,
            away_score: awayScoreObj ? awayScoreObj.score.goals : 0,
          }
        });

        // Upsert Events sequentially (Deep Dive 3 point 2.1)
        if (match.events && Array.isArray(match.events)) {
            for (const event of match.events) {
                const isVARReversal = event.type_id === 15 || event.name?.toLowerCase().includes('disallow');

                await tx.fixtureEvent.upsert({
                    where: { external_id: event.id },
                    update: {
                        minute: event.minute,
                        result: event.result,
                        is_var_reversed: isVARReversal
                    },
                    create: {
                        external_id: event.id,
                        fixture_id: upsertedFixture.id,
                        type: event.type_id?.toString() || 'unknown',
                        minute: event.minute,
                        sort_order: event.sort_order,
                        result: event.result,
                        is_var_reversed: isVARReversal,
                        raw_payload: event
                    }
                });
            }
        }

        // 2. Publish Delta to WebSockets Dispatcher via Redis
        const patchData = {
          fixtureId: upsertedFixture.id,
          externalId: matchId,
          minute: match.minute,
          home_score: homeScoreObj ? homeScoreObj.score.goals : 0,
          away_score: awayScoreObj ? awayScoreObj.score.goals : 0,
          events_count: match.events ? match.events.length : 0
          // Reversal event ID logic would be appended here if applicable
        };

        await redisPublisher.publish('live_match_patches', JSON.stringify(patchData));
        
        // 3. Cache Rewrite (Deep Dive 3 point 7)
        // Aggressively overwrite Redis cache for the REST API fallback
        await redisPublisher.setEx(`agoro:matches:live:${upsertedFixture.id}`, 15, JSON.stringify(match));
      });
    }

  } catch (error) {
    console.error('[LiveSyncWorker] Error during live sync:', error);
  }
}

// Polling Daemon wrapper
export function startLiveEngine() {
    console.log('[LiveEngine] Starting 10-second polling daemon...');
    setInterval(() => {
        syncLiveMatches();
    }, 10000);
    syncLiveMatches(); // Fire immediately
}

if (require.main === module) {
    startLiveEngine();
}
