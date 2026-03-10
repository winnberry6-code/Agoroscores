import { describe, it, expect, vi } from 'vitest';
import { liveSyncWorker } from '../../workers/syncWorker';

// Mock the dependencies
vi.mock('../../lib/prisma', () => ({
    prisma: {
        fixtureEvent: {
            findFirst: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
        }
    }
}));

describe('LiveSyncWorker - Event Processing', () => {

    it('should deduplicate identical events arriving from SportsMonks via ID', async () => {
        const mockRawEvent = { id: 9876, type: 'GOAL', minute: 23, team_id: 111 };
        const mockPrisma = await import('../../lib/prisma');
        
        // Simulate event already existing in DB
        (mockPrisma.prisma.fixtureEvent.findFirst as any).mockResolvedValue({ id: 'uuid-1', external_id: 9876n });

        const result = await liveSyncWorker.processEvent('uuid-fixture-1', mockRawEvent);
        
        expect(result).toBeNull(); // Because it was deduplicated
        expect(mockPrisma.prisma.fixtureEvent.create).not.toHaveBeenCalled();
    });

    it('should correctly mark events as reversed upon receiving a VAR cancellation', async () => {
        const mockRawEvent = { id: 9877, type: 'VAR', minute: 25, result: 'goal cancelled' };
        const mockPrisma = await import('../../lib/prisma');
         
        // Simulate VAR payload that is NOT in DB yet
        (mockPrisma.prisma.fixtureEvent.findFirst as any).mockResolvedValue(null);
        
        // Mock the creation of the VAR event
        (mockPrisma.prisma.fixtureEvent.create as any).mockResolvedValue({ id: 'uuid-var-1' });

        await liveSyncWorker.processEvent('uuid-fixture-1', mockRawEvent);
        
        // Should execute a DB update to rollback the prior goal
        expect(mockPrisma.prisma.fixtureEvent.update).toHaveBeenCalled();
    });
});
