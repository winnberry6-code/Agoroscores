import { describe, it, expect } from 'vitest';
import { momentumAnalyzer } from '../../services/momentumAnalysisService';

describe('MomentumAnalysisService', () => {
    
    it('should return exactly 0 when stats are perfectly balanced', () => {
        const home = { attacks: 50, dangerous_attacks: 10, possession: 50 };
        const away = { attacks: 50, dangerous_attacks: 10, possession: 50 };
        
        const score = momentumAnalyzer.calculatePressureScore(home, away);
        expect(score).toBe(0);
    });

    it('should calculate extreme positive score for heavy Home pressure', () => {
        const home = { attacks: 120, dangerous_attacks: 40, possession: 75 };
        const away = { attacks: 20, dangerous_attacks: 2, possession: 25 };
        
        const score = momentumAnalyzer.calculatePressureScore(home, away);
        // Math check: home dominance should be massive
        expect(score).toBeGreaterThan(60);
        expect(score).toBeLessThanOrEqual(100);
    });

    it('should calculate extreme negative score for heavy Away pressure', () => {
        const home = { attacks: 20, dangerous_attacks: 2, possession: 30 };
        const away = { attacks: 100, dangerous_attacks: 35, possession: 70 };
        
        const score = momentumAnalyzer.calculatePressureScore(home, away);
        expect(score).toBeLessThan(-50);
        expect(score).toBeGreaterThanOrEqual(-100);
    });

    it('should default missing stats appropriately to avoid NaN', () => {
        const score = momentumAnalyzer.calculatePressureScore({}, {});
        // If entirely missing, it defaults to 50/50 possession which cancels to 0
        expect(score).toBe(0);
    });
});
