import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 1. Initial Response Object
    const response = NextResponse.next();

    // 2. Security Headers (Helmet equivalents for Edge)
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

    // Content Security Policy (Basic lockdown, allows images from anywhere, script only ourselves + analytics)
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-eval' 'unsafe-inline';
        style-src 'self' 'unsafe-inline';
        img-src 'self' blob: data: https:;
        font-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();
    
    response.headers.set('Content-Security-Policy', cspHeader);

    // 3. Simple Edge Rate Limiting Block for API
    // (In production, integrating Upstash Redis here for distributed edge-limiting is standard)
    if (request.nextUrl.pathname.startsWith('/api/') && process.env.NODE_ENV === 'production') {
        const ip = request.ip || '127.0.0.1';
        // Mocking the header injection for tracking
        response.headers.set('X-RateLimit-Limit', '100');
        // Theoretically fast-reject here if limit exceeded
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
