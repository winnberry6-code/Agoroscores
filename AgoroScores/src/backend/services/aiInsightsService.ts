import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '../lib/prisma';
import { createClient } from 'redis';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
let redisClient: ReturnType<typeof createClient>;

/**
 * aiInsightsService
 * 
 * Fetches structured data from the DB, prompts Gemini 3.1 Pro for a summarized
 * tactical insight, and caches the result heavily to avoid API limits.
 */
export class AiInsightsService {
    private model: any;

    constructor() {
        this.model = genAI.getGenerativeModel({ 
            model: 'gemini-1.5-pro-latest',
            generationConfig: {
                temperature: 0.2, // Low hallucination risk
            }
        });
    }

    private async getRedis() {
        if (!redisClient) {
            redisClient = createClient({ url: process.env.REDIS_URL });
            await redisClient.connect();
        }
        return redisClient;
    }

    /**
     * Generates a Live tactical insight based on statistical deltas.
     */
    async generateLiveInsight(matchId: string, currentStats: any): Promise<string | null> {
        // 0. AI Data Freshness Guard
        // If the SyncWorker fails and data is older than 3 minutes, DO NOT ask Gemini
        // for an insight, as it will hallucinate interpretations on stale data.
        const lastUpdated = currentStats.last_updated_at ? new Date(currentStats.last_updated_at) : new Date();
        const diffMinutes = (Date.now() - lastUpdated.getTime()) / 60000;
        
        if (diffMinutes > 3) {
            console.warn(`[AI Guard] Match ${matchId} live data is stale (${diffMinutes.toFixed(1)} mins old). Aborting Gemini generation.`);
            return null; // Gracefully degrades UI to show basic stats instead of fake insights
        }

        const redis = await this.getRedis();
        const cacheKey = `insight:live:${matchId}`;
        
        // 1. Check Cache (5-minute TTL to prevent spam)
        const cachedInsight = await redis.get(cacheKey);
        if (cachedInsight) return cachedInsight;

        // 2. Build Strict AI Prompt
        const prompt = `
            You are an elite football tactical analyst for AgoroScores.
            Provide a 2-sentence summary of the match flow based ONLY on the following data.
            DO NOT invent any events, players, or historical context.
            
            Current Match State:
            - Score: ${currentStats.homeScore} - ${currentStats.awayScore}
            - Minute: ${currentStats.minute}'
            - Possession: ${currentStats.homePossession}% vs ${currentStats.awayPossession}%
            - Shots on Target: ${currentStats.homeShotsOnTarget} vs ${currentStats.awayShotsOnTarget}
            - Momentum Score (-100 Away to +100 Home): ${currentStats.momentumScore}
            
            Output your analysis in plain text.
        `;

        try {
            // 3. Request Generation
            const result = await this.model.generateContent(prompt);
            const insight = result.response.text().trim();

            // 4. Save to DB for history
            await prisma.matchInsight.create({
                data: {
                    match_id: matchId,
                    insightType: 'LIVE',
                    content: insight,
                    stats_used: currentStats
                }
            });

            // 5. Cache for 5 minutes
            await redis.setEx(cacheKey, 300, insight);

            return insight;
        } catch (error) {
            console.error(`[AI Insight] Generation failed for match ${matchId}:`, error);
            // Fallback: Swallow error silently to degrade gracefully
            return null;
        }
    }
}

export const aiInsightsService = new AiInsightsService();
