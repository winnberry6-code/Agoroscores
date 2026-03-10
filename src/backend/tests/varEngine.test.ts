import { describe, it, expect, beforeEach, vi } from 'vitest';

// Simulated dependencies that the worker usually relies on
const mockPrisma = {
    $transaction: vi.fn(),
    fixture: {
        update: vi.fn(),
        findUnique: vi.fn(),
    },
    fixtureEvent: {
        findUnique: vi.fn(),
        update: vi.fn(),
    }
};

const mockRedis = {
    publish: vi.fn()
};

// The core algorithm extracted from the Admin API for testability
async function processVarReversal(fixtureId: string, eventId: string, teamId: string) {
    // 1. Mark Event as Reversed
    await mockPrisma.fixtureEvent.update({
        where: { external_id: parseInt(eventId) },
        data: { is_var_reversed: true }
    });

    // 2. Fetch Fixture to recalculate score
    const fixture = await mockPrisma.fixture.findUnique({ where: { external_id: parseInt(fixtureId) }});
    
    let newHomeScore = fixture.home_score;
    let newAwayScore = fixture.away_score;

    if (fixture.home_team_id === teamId && newHomeScore > 0) {
        newHomeScore -= 1;
    } else if (fixture.away_team_id === teamId && newAwayScore > 0) {
        newAwayScore -= 1;
    }

    // 3. Update Fixture
    const updatedFixture = await mockPrisma.fixture.update({
        where: { external_id: parseInt(fixtureId) },
        data: { home_score: newHomeScore, away_score: newAwayScore }
    });

    // 4. Publish WS Patch
    await mockRedis.publish('live_match_patches', JSON.stringify({
        fixtureId: updatedFixture.id,
        externalId: fixtureId,
        home_score: updatedFixture.home_score,
        away_score: updatedFixture.away_score,
        var_reversal_event: eventId
    }));

    return updatedFixture;
}

describe('VAR Reversal Engine', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
        
        // Setup default mock responses
        mockPrisma.fixture.findUnique.mockResolvedValue({
            id: 'uuid-123',
            external_id: parseInt('999'),
            home_team_id: 'team-home',
            away_team_id: 'team-away',
            home_score: 2,
            away_score: 1,
            status_minute: 45
        });

        // The update mock just returns what it was given merged with base
        mockPrisma.fixture.update.mockImplementation(async ({ data }) => {
            return {
                id: 'uuid-123',
                home_score: data.home_score,
                away_score: data.away_score,
                status_minute: 45
            }
        });
    });

    it('should correctly decrement the home score when a home goal is disallowed', async () => {
        const result = await processVarReversal('999', '100', 'team-home');
        
        // Assert Score logic
        expect(result.home_score).toBe(1); // 2 - 1 = 1
        expect(result.away_score).toBe(1); // Unchanged
        
        // Assert Event was marked
        expect(mockPrisma.fixtureEvent.update).toHaveBeenCalledWith(
            expect.objectContaining({ data: { is_var_reversed: true } })
        );

        // Assert correct Redis patch was fired
        expect(mockRedis.publish).toHaveBeenCalledWith(
            'live_match_patches',
            expect.stringContaining('"home_score":1')
        );
        expect(mockRedis.publish).toHaveBeenCalledWith(
            'live_match_patches',
            expect.stringContaining('"var_reversal_event":"100"')
        );
    });

    it('should correctly decrement the away score when an away goal is disallowed', async () => {
        const result = await processVarReversal('999', '101', 'team-away');
        
        expect(result.home_score).toBe(2); // Unchanged
        expect(result.away_score).toBe(0); // 1 - 1 = 0
    });

    it('should not drop a score below 0', async () => {
        // Override mock to simulate 0-0 match
        mockPrisma.fixture.findUnique.mockResolvedValueOnce({
            id: 'uuid-123',
            home_team_id: 'team-home',
            away_team_id: 'team-away',
            home_score: 0,
            away_score: 0,
        });

        const result = await processVarReversal('999', '102', 'team-home');
        
        // Despite being a home team reversal, score stays at 0
        expect(result.home_score).toBe(0);
        expect(result.away_score).toBe(0);
    });
});
