import { prisma } from '../lib/prisma';
import { createClient } from 'redis';
import { z } from 'zod';

let redisClient: ReturnType<typeof createClient>;

/**
 * Zod Schemas for input validation to prevent NoSQL/Object injection
 */
const PostMessageSchema = z.object({
    matchId: z.string().uuid(),
    userId: z.string().uuid(),
    content: z.string().min(1, "Message cannot be empty").max(250, "Message exceeds 250 characters")
});

const ReactionSchema = z.object({
    matchId: z.string().uuid(),
    emoji: z.string().emoji().max(5, "Invalid emoji length")
});

/**
 * discussionService
 * 
 * Handles real-time localized fan chatter, emoji reactions, and strict moderation policies.
 */
export class DiscussionService {
    
    private PUSH_RATE_LIMIT_S = 5;
    private BANNED_WORDS = ['spam', 'abuse', 'insult']; // Simulated regex list

    private async getRedis() {
        if (!redisClient) {
            redisClient = createClient({ url: process.env.REDIS_URL });
            await redisClient.connect();
        }
        return redisClient;
    }

    /**
     * Accepts a user message, validates moderation, persists, and broadcasts.
     */
    async postMessage(rawMatchId: string, rawUserId: string, rawContent: string): Promise<boolean> {
        // 1. Strict Input Sanitization & Validation via Zod
        const { matchId, userId, content } = PostMessageSchema.parse({ 
            matchId: rawMatchId, 
            userId: rawUserId, 
            content: rawContent 
        });

        const redis = await this.getRedis();

        // 2. Rate Limiting Check
        const rateKey = `rate:chat:${userId}`;
        const isLimited = await redis.get(rateKey);
        if (isLimited) throw new Error('You are posting too fast. Please wait.');

        // 3. Pre-flight Moderation Check
        for (const word of this.BANNED_WORDS) {
            if (content.toLowerCase().includes(word)) {
                console.warn(`[Moderation] Blocked message from ${userId}`);
                return false;
            }
        }

        // 4. User Sanction Sandbox Check
        const sanction = await prisma.userSanction.findUnique({ where: { user_id: userId } });
        if (sanction && sanction.banned) throw new Error('Account permanently banned from discussions.');
        if (sanction && sanction.muted_until && new Date() < sanction.muted_until) throw new Error('Account temporarily muted.');

        // 5. Persistence
        const msg = await prisma.fanMessage.create({
            data: { match_id: matchId, user_id: userId, content }
        });

        // 6. Rate limit the user
        await redis.setEx(rateKey, this.PUSH_RATE_LIMIT_S, '1');

        // 7. Broadcast via Redis Pub/Sub for WebSockets to catch
        await redis.publish(`channel:match:${matchId}:chat`, JSON.stringify(msg));

        return true;
    }

    /**
     * Records a rapid-fire emoji reaction (e.g. 🔥, 😱, 🥱)
     */
    async incrementReaction(rawMatchId: string, rawEmoji: string) {
        // 1. Strict validation
        const { matchId, emoji } = ReactionSchema.parse({ matchId: rawMatchId, emoji: rawEmoji });

        const redis = await this.getRedis();
        // Uses Redis atomic increments
        const reactKey = `react:match:${matchId}:${emoji}`;
        await redis.incr(reactKey);
        // Ensure keys decay after 60s so sentiment is always "Current"
        await redis.expire(reactKey, 60);
    }
}

export const discussionService = new DiscussionService();
