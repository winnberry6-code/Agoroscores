import { NextResponse } from 'next';
import { prisma } from '@/backend/lib/prisma';

export const revalidate = 300; // 5-minute CDN edge cache

/**
 * GET /api/v1/news
 * 
 * Fetches paginated news articles with AI summaries.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const category = searchParams.get('category');
    const pageSize = 10;

    const whereClause = category ? { category } : {};

    const [articles, totalCount] = await Promise.all([
        prisma.newsArticle.findMany({
            where: whereClause,
            orderBy: { published_at: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
            // Omit raw_content to save massive bandwidth on list views
            select: {
                id: true,
                title: true,
                image_url: true,
                category: true,
                ai_summary: true,
                published_at: true,
                source_url: true
            }
        }),
        prisma.newsArticle.count({ where: whereClause })
    ]);

    return NextResponse.json({ 
        success: true, 
        data: articles,
        meta: {
            page,
            total_pages: Math.ceil(totalCount / pageSize),
            total_count: totalCount
        }
    }, {
        headers: {
             // Cache aggressively at the edge for 5 minutes
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        }
    });

  } catch (error) {
    console.error('[API] /news error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
