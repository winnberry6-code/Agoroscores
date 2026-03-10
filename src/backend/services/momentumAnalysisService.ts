/**
 * momentumAnalysisService
 * 
 * Transforms raw SportsMonks event counters into a smoothed -100 to +100 float 
 * representing Match Rhythm and Pressure.
 * Negative = Away Team Pressure
 * Positive = Home Team Pressure
 */
export class MomentumAnalysisService {

    /**
     * Calculates the current pressure score for a given point in time.
     * @param homeStats Raw stats like { attacks, dangerous_attacks, possession }
     * @param awayStats Raw stats like { attacks, dangerous_attacks, possession }
     * @returns number between -100 and +100
     */
    calculatePressureScore(homeStats: any, awayStats: any): number {
        // Safe defaults
        const hAtk = homeStats?.attacks || 0;
        const aAtk = awayStats?.attacks || 0;
        const hDAtk = homeStats?.dangerous_attacks || 0;
        const aDAtk = awayStats?.dangerous_attacks || 0;
        const hPoss = homeStats?.possession || 50;
        const aPoss = awayStats?.possession || (100 - hPoss);

        // Weightings: Dangerous Attacks are worth 3x standard attacks. Possession is a base modifier.
        const homeWeight = (hAtk * 1) + (hDAtk * 3) + (hPoss * 0.5);
        const awayWeight = (aAtk * 1) + (aDAtk * 3) + (aPoss * 0.5);

        const totalWeight = homeWeight + awayWeight;

        if (totalWeight === 0) return 0;

        // Calculate a 0-100 dominance percentage for the Home team
        const homeDominance = (homeWeight / totalWeight) * 100;

        // Map it to a -100 (100% Away) to +100 (100% Home) scale
        let momentumScore = (homeDominance - 50) * 2;

        // Clamp it for safety
        if (momentumScore > 100) momentumScore = 100;
        if (momentumScore < -100) momentumScore = -100;

        // Apply a smoothing factor or ceiling to prevent jaggedness if necessary
        return Math.round(momentumScore);
    }
}

export const momentumAnalyzer = new MomentumAnalysisService();


/**
 * turningPointDetectionService
 * 
 * Analyzes event streams and momentum history to categorically flag match shifts.
 */
export class TurningPointDetectionService {

    /**
     * Inspects a newly arrived event against recent history to see if it qualifies
     * as a major turning point (e.g. Goal against the run of play).
     */
    detectTurningPoint(event: any, previousMomentumScores: number[]): { isTurningPoint: boolean, reason?: string } {
        // Red Cards are always a turning point
        if (event.type === 'RED_CARD') {
            return { isTurningPoint: true, reason: 'Tactical disruption via Red Card' };
        }

        // Check for "Goal against the run of play"
        if (event.type === 'GOAL') {
            const scoringTeam = event.team; // 'home' or 'away'
            
            // Average momentum over the last 5 ticks
            if (previousMomentumScores.length >= 5) {
                const recentMomentum = previousMomentumScores.slice(-5).reduce((a, b) => a + b, 0) / 5;
                
                if (scoringTeam === 'home' && recentMomentum < -40) {
                    return { isTurningPoint: true, reason: 'Home goal against heavy Away pressure' };
                }
                if (scoringTeam === 'away' && recentMomentum > 40) {
                    return { isTurningPoint: true, reason: 'Away goal against heavy Home pressure' };
                }
            }
            return { isTurningPoint: true, reason: 'Crucial Scoreline Shift' };
        }

        // Check for massive raw momentum shift independently of goals
        if (previousMomentumScores.length >= 2) {
            const current = previousMomentumScores[previousMomentumScores.length - 1];
            const previous = previousMomentumScores[previousMomentumScores.length - 2];
            
            if (Math.abs(current - previous) > 60) {
                return { isTurningPoint: true, reason: 'Massive shift in territorial dominance' };
            }
        }

        return { isTurningPoint: false };
    }
}

export const turningPointDetector = new TurningPointDetectionService();
