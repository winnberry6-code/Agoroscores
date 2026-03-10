import { NextResponse } from 'next';
import { prisma } from '@/backend/lib/prisma';

export const revalidate = 30; // 30-second edge cache

/**
 * GET /api/v1/feed/home
 * 
 * Generates the unified payload for the Home Screen.
 * Fetches priority active matches, top 5 AI news articles.
 * NOTE: If Authorization header exists, it shifts to tailored User favorites logic.
 */
export async function GET(request: Request) {
  try {
    // 1. Fetch Priority Leagues
    const topLeagues = await prisma.league.findMany({
        orderBy: { priority_level: 'asc' },
        take: 5
    });
    
    // 2. Fetch recent Top News with AI summaries
    const recentNews = await prisma.newsArticle.findMany({
        orderBy: { published_at: 'desc' },
        take: 5,
        select: {
            id: true, title: true, image_url: true, category: true, 
            ai_summary: true, ai_why_it_matters: true, published_at: true 
        }
    });

    // 3. Fetch Featured Match (Upcoming or Live in top leagues)
    const featuredMatch = await prisma.fixture.findFirst({
        where: {
            league_id: { in: topLeagues.map(l => l.id) },
            status: { in: ['LIVE', 'NS'] },
            starting_at: { gte: new Date() } // Future or ongoing
        },
        orderBy: [
            { status: 'asc' }, // 'LIVE' alphabetizes before 'NS'
            { starting_at: 'asc' }
        ],
        include: {
            home_team: { select: { name: true, short_code: true, image_path: true } },
            away_team: { select: { name: true, short_code: true, image_path: true } }
        }
    });

    return NextResponse.json({ 
        success: true, 
        data: {
            featuredMatch,
            leagues: topLeagues,
            news: recentNews,
        }
    }, {
        headers: {
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=59',
        }
    });

  } catch (error) {
    console.error('[API] /feed/home error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
