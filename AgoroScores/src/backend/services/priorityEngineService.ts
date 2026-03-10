import { prisma } from '../lib/prisma';

export interface PriorityScore {
    score: number;
    tier: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
}

/**
 * priorityEngineService
 * 
 * Determines the real-time importance of a given football entity (Match or League).
 * Used by the LiveSyncWorker to determine polling frequency, and the Frontend to order components.
 */
export class PriorityEngineService {

    /**
     * Calculates the sync urgency for a League based on live match density and inherent tier.
     */
    async calculateLeagueUrgency(leagueId: string): Promise<PriorityScore> {
        // 1. Base Multipliers
        const league = await prisma.league.findUnique({ 
            where: { id: leagueId },
            select: { priority_level: true }
        });

        if (!league) return { score: 0, tier: 'LOW' };

        // Inverse priorities: 1 (EPL) = Base Score 100, 50 (Finnish 3.D) = Base Score 2
        const baseScore = Math.max(100 - (league.priority_level * 2), 0);

        // 2. Live Density Multiplier
        const liveMatchCount = await prisma.fixture.count({
            where: {
                league_id: leagueId,
                status: { in: ['LIVE', 'HT', 'PEN_LIVE'] }
            }
        });

        // 3. User Favorites Density (Simulated - would query Redis sets holding user fav clusters)
        const activeFollowers = Math.floor(Math.random() * 500); // Mock data

        // Mathematical formulation
        const score = baseScore + (liveMatchCount * 50) + (activeFollowers * 0.1);

        if (score > 150) return { score, tier: 'CRITICAL' };
        if (score > 80) return { score, tier: 'HIGH' };
        if (score > 30) return { score, tier: 'NORMAL' };
        return { score, tier: 'LOW' };
    }

    /**
     * Evaluates a singular match's UI prominence score.
     */
    calculateMatchProminence(match: any, isUserFavorite: boolean = false): number {
        let score = 0;

        // Base Points
        if (match.status === 'LIVE' || match.status === 'PEN_LIVE') score += 100;
        if (match.status === 'HT') score += 50;

        // Event Intensity
        const goalsDiff = Math.abs(match.home_score - match.away_score);
        if (goalsDiff === 0 && match.status !== 'NS') score += 20; // Tension bonus for draws
        if (match.status_minute > 80) score += 30; // Late game drama bonus

        // Personalization
        if (isUserFavorite) score += 500; // Overrides almost everything

        return score;
    }
}

export const priorityEngine = new PriorityEngineService();
