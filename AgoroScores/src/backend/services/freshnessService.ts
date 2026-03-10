/**
 * freshnessService
 * 
 * Attaches real-time metadata to API payloads to prevent UI trickery during API outages.
 * Calculates explicit lag between the application clock and the SportsMonks `last_synced_at` signature.
 */
export class FreshnessService {
    
    /**
     * Injects strict `_meta` wrappers onto standard JSON payloads.
     * @param payload The raw database or Cache object
     * @param lastSyncedAt The timestamp the data was acquired from SportsMonks
     * @param isLiveContext Defines if the request expects real-time fidelity
     */
    wrapWithFreshness(payload: any, lastSyncedAt: Date, isLiveContext: boolean = false) {
        
        const staleThresholdSeconds = isLiveContext ? 30 : 3600; // 30s strict cutoff for live matches
        const msSinceSync = new Date().getTime() - lastSyncedAt.getTime();
        const secondsSinceSync = Math.floor(msSinceSync / 1000);

        // Calculate a 0-100 score where 100 is instant and 0 is heavily lagging
        let freshnessScore = 100 - ((secondsSinceSync / staleThresholdSeconds) * 100);
        if (freshnessScore < 0) freshnessScore = 0;

        const isSourceLagging = secondsSinceSync > staleThresholdSeconds;

        return {
            _meta: {
                synced_at: lastSyncedAt.toISOString(),
                freshness_score: Math.round(freshnessScore),
                stale_threshold_seconds: staleThresholdSeconds,
                source_lag_detected: isSourceLagging
            },
            data: payload
        };
    }

    /**
     * Scrutinizes an array of live matches to orchestrate a global "Feed Delayed" banner flag.
     */
    detectSystemicLag(liveMatches: Array<{ last_synced_at: Date }>): boolean {
        if (!liveMatches || liveMatches.length === 0) return false;

        const now = new Date().getTime();
        let laggingCount = 0;

        for (const match of liveMatches) {
            if (now - match.last_synced_at.getTime() > 45000) { // 45s hard lag
                laggingCount++;
            }
        }

        // If more than 50% of the active live pipeline is lagging, the provider is likely hiccuping.
        const lagRatio = laggingCount / liveMatches.length;
        return lagRatio > 0.5;
    }
}

export const freshnessService = new FreshnessService();
