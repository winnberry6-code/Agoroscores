import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';
import { createClient } from 'redis'; // Phase 3 defined Redis for Pub/Sub
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

/**
 * Custom Next.js server to run Socket.io and Redis Pub/Sub internally
 */
app.prepare().then(async () => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new SocketIOServer(server, {
    cors: { origin: '*' }
  });

  // Redis Subscriber Client for Live Engine events
  const redisSubscriber = createClient({ url: process.env.REDIS_URL });
  await redisSubscriber.connect();

  console.log('[LiveEngine] Connected to Redis Pub/Sub');

  // Listen for Live Engine patches from the SyncWorker
  redisSubscriber.subscribe('live_match_patches', (message) => {
    try {
      const patch = JSON.parse(message);
      // Example: patch = { fixtureId: "123", minute: 45, home_score: 1 }
      
      // Broadcast to users viewing the Global Matches list
      io.to('global_live').emit('fixture_delta', patch);
      
      // Broadcast to users deep in the specific Match Detail page
      io.to(`match:${patch.fixtureId}`).emit('fixture_delta', patch);
      
    } catch (e) {
      console.error('[LiveEngine] Failed to parse Redis message', e);
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Client subscribing to the live active ticker
    socket.on('subscribe_global_live', () => {
      socket.join('global_live');
      console.log(`[Socket] ${socket.id} joined global_live`);
    });

    // Client subscribing to a specific match detail view
    socket.on('subscribe_match', (fixtureId: string) => {
      socket.join(`match:${fixtureId}`);
      console.log(`[Socket] ${socket.id} joined match:${fixtureId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`> AgoroScores Backend & Live Engine running on http://localhost:${PORT}`);
  });
});
