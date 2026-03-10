import { prisma } from '../lib/prisma';
import { SportsMonksClient } from './SportsMonksClient';
import { format, addDays, subDays } from 'date-fns';

const client = new SportsMonksClient();

/**
 * SyncDailyFixturesJob
 * Runs at 00:01 UTC. Fetches all matches for T-1, T0, and T+1.
 */
export async function syncDailyFixtures() {
  console.log('[SyncJob] Starting daily fixtures sync...');
  const todayDate = new Date();
  
  // Format dates for SportsMonks parameter (YYYY-MM-DD)
  const targetDates = [
    format(subDays(todayDate, 1), 'yyyy-MM-dd'),
    format(todayDate, 'yyyy-MM-dd'),
    format(addDays(todayDate, 1), 'yyyy-MM-dd')
  ];

  try {
    for (const dateStr of targetDates) {
      console.log(`[SyncJob] Fetching fixtures for ${dateStr}...`);
      const response = await client.getFixturesByDate(dateStr);
      const fixtures = response.data;

      if (!fixtures || fixtures.length === 0) continue;

      console.log(`[SyncJob] Upserting ${fixtures.length} fixtures for ${dateStr}`);
      
      // Batch Upsert using transactions for safety
      await prisma.$transaction(
        fixtures.map((fixture: any) => 
          prisma.fixture.upsert({
            where: { external_id: fixture.id },
            update: {
              status: fixture.state?.state || 'NS',
              starting_at: new Date(fixture.starting_at),
              name: fixture.name,
              last_synced_at: new Date(),
              raw_payload: fixture,
            },
            create: {
              external_id: fixture.id,
              league_id: 'placeholder-needs-league-sync', 
              home_team_id: 'placeholder-needs-team-sync',
              away_team_id: 'placeholder-needs-team-sync',
              starting_at: new Date(fixture.starting_at),
              status: fixture.state?.state || 'NS',
              name: fixture.name,
              last_synced_at: new Date(),
              raw_payload: fixture,
            }
          })
        )
      );
    }
    
    // Log Sync Health
    await prisma.syncJobHealth.upsert({
      where: { job_name: 'syncDailyFixtures' },
      update: { last_run_at: new Date(), last_success_at: new Date(), error_count: 0 },
      create: { job_name: 'syncDailyFixtures', last_run_at: new Date(), last_success_at: new Date() }
    });

    console.log('[SyncJob] Daily fixtures sync completed successfully.');

  } catch (error: any) {
    console.error('[SyncJob] Failed to sync daily fixtures:', error.message);
    
    // Log negative health
    await prisma.syncJobHealth.upsert({
      where: { job_name: 'syncDailyFixtures' },
      update: { last_run_at: new Date(), error_count: { increment: 1 }, last_error_message: error.message },
      create: { job_name: 'syncDailyFixtures', last_run_at: new Date(), error_count: 1, last_error_message: error.message }
    });
  }
}
