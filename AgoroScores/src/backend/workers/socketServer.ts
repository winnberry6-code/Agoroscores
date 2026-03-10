import { Server } from 'socket.io';
import { createServer } from 'http';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { logger } from '../lib/logger';

const port = process.env.WS_PORT || 3001;
const httpServer = createServer();

/**
 * Isolated WebSocket Edge Server
 * This process ONLY maintains TCP connections and routes messages via Redis.
 * It does not parse heavy logic or talk directly to the Database.
 */
const startSocketServer = async () => {
    // We use the Redis Adapter so we can spin up 10 of these servers
    // and broadcast across them seamlessly.
    const pubClient = createClient({ url: process.env.REDIS_URL });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    const io = new Server(httpServer, {
        cors: { origin: '*' },
        adapter: createAdapter(pubClient, subClient)
    });

    io.on('connection', (socket) => {
        logger.info(\`[SocketServer] Client Connected: \${socket.id}\`);

        // Clients explicitly subscribe to ONE match to prevent data firehoses
        socket.on('subscribe:match', (matchId: string) => {
            logger.info(\`[SocketServer] \${socket.id} joined room \${matchId}\`);
            socket.join(\`room_match_\${matchId}\`);
            // Optional: Send initial state catch-up here
        });

        // Clients unsubscribe when leaving the Match Details page
        socket.on('unsubscribe:match', (matchId: string) => {
            logger.info(\`[SocketServer] \${socket.id} left room \${matchId}\`);
            socket.leave(\`room_match_\${matchId}\`);
        });

        socket.on('disconnect', () => {
            logger.info(\`[SocketServer] Client Disconnected: \${socket.id}\`);
        });
    });

    // The backend workers (e.g. SyncWorker) will publish events to standard Redis PubSub
    // We listen to those specific backend events and translate them into Socket Room emits.
    const internalSub = subClient.duplicate();
    await internalSub.connect();

    internalSub.pSubscribe('broadcast:match:*', (message, channel) => {
        // channel looks like: broadcast:match:123
        const parts = channel.split(':');
        const matchId = parts[2];
        const payload = JSON.parse(message);

        // Emit ONLY to the connected clients sitting explicitly in that Match Details page
        io.to(\`room_match_\${matchId}\`).emit('match_update', payload);
    });

    httpServer.listen(port, () => {
        logger.info(\`[SocketServer] Listening for Edge Websocket Connections on port \${port}\`);
    });
};

startSocketServer().catch(err => {
    logger.error('[SocketServer] Fatal startup error', { error: err });
    process.exit(1);
});
