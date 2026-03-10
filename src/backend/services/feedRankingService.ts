import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * feedRankingService
 * 
 * Uses Gemini 3.1 Pro via structured prompts to contextually reorder the user's Homepage.
 * Takes the current system state (live matches count, top news) and returns an exact optimal layout order.
 */
export class FeedRankingService {
    private model: any;

    constructor() {
        this.model = genAI.getGenerativeModel({ 
            model: 'gemini-1.5-pro-latest',
            generationConfig: {
                temperature: 0.1, // Near-zero hallucination probability
                responseMimeType: 'application/json' // Forces pure JSON array output
            }
        });
    }

    /**
     * Determines whether the Homepage should lead with 'LIVE_HERO', 'TRENDING_NEWS', or 'UPCOMING_GRID'.
     */
    async deriveHomepageLayout(context: { liveMatchesCount: number, topNewsCategory: string, isWeekend: boolean }): Promise<string[]> {
        
        // Fast-path bypass to save API limits. If heavy live matches, simply override manually.
        if (context.liveMatchesCount > 15) {
            return ['LIVE_HERO_TRACKER', 'MAJOR_LEAGUES_CAROUSEL', 'TRENDING_NEWS'];
        }

        const prompt = `
            You are the algorithm powering the AgoroScores mobile application homepage.
            Your task is to rank the 3 priority UI blocks based on the current football ecosystem context.
            
            Current Context:
            - Live Matches Active: ${context.liveMatchesCount}
            - Leading News Topic: ${context.topNewsCategory}
            - Is Weekend: ${context.isWeekend}

            Available UI Blocks:
            - LIVE_HERO_TRACKER (Immersive single match viewer)
            - MAJOR_LEAGUES_CAROUSEL (Horizontal scroll of active leagues)
            - TRENDING_NEWS (Vertical news feed)
            - UPCOMING_GRID (Static grid of future matches)

            Rules:
            - If it's a weekend with few live matches, prioritize UPCOMING_GRID.
            - If news is "Transfers" and live matches are 0, prioritize TRENDING_NEWS.
            - Output ONLY a JSON array of 3 strings ranking the blocks from top to bottom. Example: ["block1", "block2", "block3"]
        `;

        try {
            const result = await this.model.generateContent(prompt);
            const rawOutput = result.response.text();
            
            // Clean up Markdown formatting if any leaked through
            const cleanArray = JSON.parse(rawOutput.replace(/```json\n|\n```|```/g, '').trim());
            return cleanArray;
            
        } catch (error) {
            console.error('[FeedRankingService] Failed to generate AI layout. Tripping Circuit Breaker to default layout.', error);
            // Default Fallback guaranteeing system resilience
            return ['UPCOMING_GRID', 'MAJOR_LEAGUES_CAROUSEL', 'TRENDING_NEWS'];
        }
    }
}

export const feedRankingService = new FeedRankingService();
