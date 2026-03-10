import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

/**
 * Initializes a singleton WebSocket connection designed to handle massive scale.
 * Implements mathematical jitter to prevent thundering herds on recovery.
 */
export const initializeSocket = (userId?: string): Socket => {
    if (socket) return socket;

    socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001', {
        reconnectionDelay: 1000,
        reconnectionDelayMax: 10000, // Maximum wait time
        randomizationFactor: 0.5, // 50% jitter = e.g., if delay is 2s, actual is 1s to 3s
        reconnectionAttempts: Infinity, // Keep trying silently in background
        transports: ['websocket'], // Force websockets, skip long-polling overhead
        auth: {
            token: userId ? `token_${userId}` : undefined
        }
    });

    socket.on('connect', () => {
        console.log('[Socket] Connected to Live Edge:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
        console.warn('[Socket] Disconnected from Edge:', reason);
        // Clean up UI state here if necessary (e.g., show "Reconnecting" banner)
    });
    
    socket.on('connect_error', (error) => {
        // Suppress massive connection error logs from overwhelming the browser console
        if (process.env.NODE_ENV !== 'production') {
            console.error('[Socket] Connection Failed:', error.message);
        }
    });

    return socket;
};

export const getSocket = () => socket;

/**
 * Opt-in subscription model. Prevents the device from receiving every global event.
 */
export const subscribeToMatch = (matchId: string) => {
    if (socket && socket.connected) {
        socket.emit('subscribe:match', matchId);
    }
};

export const unsubscribeFromMatch = (matchId: string) => {
    if (socket && socket.connected) {
        socket.emit('unsubscribe:match', matchId);
    }
};
