/**
 * deliveryOptimizationService
 * 
 * Intercepts data flows on the client side to prevent browser stutter, memory leaks,
 * and high data usage when the application is backgrounded.
 */

export class DeliveryOptimizationService {
    
    /**
     * Governs whether the WebSocket should remain active. 
     * E.g., drops active sockets when the user locks their phone.
     */
    shouldMaintainWebSocket(documentState: DocumentVisibilityState, isBatteryLow: boolean): boolean {
        // If the user's phone is locked / tab is hidden, sever the hungry WebSocket connection.
        // It will be instantly re-established using predictivePreloadService on foregrounding.
        if (documentState === 'hidden') {
            console.log('[DeliveryOptimization] Tab hidden. Severing WebSockets to save battery.');
            return false; 
        }

        // If Android/iOS reports battery saver mode, degrade to HTTP polling.
        if (isBatteryLow) {
            console.log('[DeliveryOptimization] Low Power Mode detected. Downgrading to 15s SWR HTTP polling.');
            return false;
        }

        return true;
    }

    /**
     * Trims massive payloads before feeding them into React state to prevent memory bloating.
     * Often Next.js sends giant arrays to the client. This strips unnecessary schema.
     */
    shrinkPayloadForClient(rawFixtureList: any[]) {
        return rawFixtureList.map(fixture => ({
            id: fixture.id,
            status: fixture.status,
            minute: fixture.status_minute,
            h_score: fixture.home_score,
            a_score: fixture.away_score,
            h_name: fixture.home_team.short_code, // Delivering 'ARS' instead of 'Arsenal Football Club'
            a_name: fixture.away_team.short_code
            // Omitted: 50+ relational fields, lineups, deep stats for this top-level view.
        }));
    }

    /**
     * Enforces the "Skeletons First" partial rendering layout.
     */
    getReactSuspenseConfig() {
        return {
            fallbackDuration: 150, // Don't flash skeletons if data loads under 150ms
            enableSelectiveHydration: true
        };
    }
}

export const deliveryOptimizer = new DeliveryOptimizationService();
