import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000');
  }
  return socket;
};

export function useLiveMatchSubscription(room: 'global_live' | `match:${string}`) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const activeSocket = initSocket();

    // Join the specified room
    if (room === 'global_live') {
      activeSocket.emit('subscribe_global_live');
    } else {
      const matchId = room.split(':')[1];
      activeSocket.emit('subscribe_match', matchId);
    }

    const handleDelta = (patch: any) => {
      console.log('[useLiveMatchSubscription] Received patch:', patch);
      
      // Abstract example of optimistic UI update for the match list
      queryClient.setQueryData(['matches', 'live'], (oldData: any[]) => {
        if (!oldData) return oldData;
        
        return oldData.map((fixture) => {
            if (fixture.id === patch.fixtureId) {
                return {
                    ...fixture,
                    home_score: patch.home_score ?? fixture.home_score,
                    away_score: patch.away_score ?? fixture.away_score,
                    status_minute: patch.minute,
                }
            }
            return fixture;
        });
      });
    };

    activeSocket.on('fixture_delta', handleDelta);

    return () => {
      activeSocket.off('fixture_delta', handleDelta);
      // Clean up room logic would go here
    };
  }, [room, queryClient]);
}
