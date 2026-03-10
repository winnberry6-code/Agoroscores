import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { logger } from './logger';

const JWT_SECRET = process.env.JWT_SECRET || 'agoro_dev_secret_override_me';

export interface DecodedToken {
    userId: string;
    role: string;
    iat: number;
    exp: number;
}

/**
 * Extracts and strictly verifies a JWT from the request headers.
 * Rejects if missing, malformed, expired, or lacking ADMIN privileges.
 */
export const verifyAdminToken = (req: NextRequest): DecodedToken | null => {
    try {
        const authHeader = req.headers.get('authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            logger.warn('[AuthGuard] Missing or malformed Authorization header');
            return null;
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

        if (decoded.role !== 'admin' && decoded.role !== 'superadmin') {
            logger.warn(\`[AuthGuard] Forbidden access attempt by User \${decoded.userId} (Role: \${decoded.role})\`);
            return null;
        }

        return decoded;
    } catch (error) {
        logger.error('[AuthGuard] Token verification failed:', { error: (error as Error).message });
        return null; // Could be TokenExpiredError or JsonWebTokenError
    }
};
