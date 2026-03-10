import { NextResponse } from 'next';
import { prisma } from '@/backend/lib/prisma';
import { createClient } from 'redis';

let redisPublisher: ReturnType<typeof createClient>;

async function initRedis() {
  if (!redisPublisher) {
    redisPublisher = createClient({ url: process.env.REDIS_URL });
    await redisPublisher.connect();
  }
}

/**
 * POST /api/v1/admin/simulate-var
 * 
 * Simulates a VAR reversal for testing the frontend WebSocket patching.
 * (Deep Dive 3 - VAR Reversal Workflow)
 */
export async function POST(request: Request) {
  try {
    // 1. Verify SuperAdmin (Mocked)
    // const user = await verifyAdminJWT(request); 

    const body = await request.json();
    const { fixtureId, eventId, actionType } = body;

    if (!fixtureId || !eventId || actionType !== 'disallow') {
        return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    // 2. Override Postgres
    await prisma.$transaction(async (tx) => {
        const targetEvent = await tx.fixtureEvent.findUnique({ where: { external_id: parseInt(eventId) } });
        if (!targetEvent) throw new Error('Event not found');

        // Mark event as reversed
        await tx.fixtureEvent.update({
            where: { external_id: parseInt(eventId) },
            data: { is_var_reversed: true }
        });

        // Recalculate score (simplified simulation: dropping home score by 1 if it was a home goal)
        // A real system reads the SM payload 'scores' array, but for simulation we just decrement.
        const fixture = await tx.fixture.findUnique({ where: { external_id: parseInt(fixtureId) } });
        
        let newHomeScore = fixture?.home_score || 0;
        if (targetEvent.team_id === fixture?.home_team_id && newHomeScore > 0) {
            newHomeScore -= 1;
        }

        const updatedFixture = await tx.fixture.update({
            where: { external_id: parseInt(fixtureId) },
            data: { home_score: newHomeScore }
        });

        // 3. Dispatch WebSocket Patch via Redis
        await initRedis();
        const patchData = {
          fixtureId: updatedFixture.id,
          externalId: fixtureId,
          minute: updatedFixture.status_minute, // Freeze minute
          home_score: updatedFixture.home_score,
          away_score: updatedFixture.away_score,
          var_reversal_event: targetEvent.id
        };

        await redisPublisher.publish('live_match_patches', JSON.stringify(patchData));
    });

    return NextResponse.json({ success: true, message: 'VAR Reversal simulated across DB and WS channels.' });

  } catch (error: any) {
    console.error('[API] /admin/simulate-var error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
