'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface MatchRowProps {
  fixture: any;
  recentDeltaEventId?: string; // Passed from Zustand if this match recently patched
}

export const MatchRow: React.FC<MatchRowProps> = ({ fixture, recentDeltaEventId }) => {
  const [showLiveTicker, setShowLiveTicker] = useState(false);

  // Deep Dive 3 - Just Updated Ticker Logic
  useEffect(() => {
    if (recentDeltaEventId) {
        setShowLiveTicker(true);
        const timer = setTimeout(() => setShowLiveTicker(false), 8000);
        return () => clearTimeout(timer);
    }
  }, [recentDeltaEventId]);

  const isLive = ['LIVE', 'HT', 'PEN_LIVE'].includes(fixture.status);
  const isStale = isLive && (new Date().getTime() - new Date(fixture.last_synced_at).getTime() > 180000); // 3 mins threshold

  return (
    <Link href={`/match/${fixture.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className={`card match-row hover-scale ${showLiveTicker ? 'flash-update' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
            
            {/* Status Column */}
            <div className="match-status" style={{ width: '60px', color: isLive ? 'var(--accent-danger)' : 'var(--text-tertiary)', fontWeight: 'bold' }}>
                {isLive ? (
                    <>
                        <span className="pulse-live" style={{ background: isStale ? 'var(--accent-warning)' : 'var(--accent-danger)' }}></span>
                        {fixture.status === 'HT' ? 'HT' : `${fixture.status_minute}'`}
                    </>
                ) : (
                    fixture.status === 'NS' ? (new Date(fixture.starting_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) : 'FT'
                )}
            </div>

            {/* Teams Column */}
            <div className="match-teams" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', opacity: isLive ? 1 : 0.7 }}>
                
                {/* 8-Second Ticker Overlay */}
                {showLiveTicker && (
                    <div style={{ position: 'absolute', top: 0, left: '80px', right: '50px', bottom: 0, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', zIndex: 2, paddingLeft: '1rem', color: 'var(--text-primary)', fontWeight: 'bold', animation: 'fadeIn 0.3s' }}>
                        ⚽ {fixture.status_minute}' Goal!
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '2rem' }}>
                    <span>{fixture.home_team?.name || 'Home'}</span>
                    <strong>{fixture.status !== 'NS' ? fixture.home_score : '-'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '2rem' }}>
                    <span>{fixture.away_team?.name || 'Away'}</span>
                    <strong>{fixture.status !== 'NS' ? fixture.away_score : '-'}</strong>
                </div>
            </div>

            {/* Premium Indicator */}
            {fixture.has_premium_stats && (
                <div style={{ position: 'absolute', right: '10px', top: '10px', fontSize: '0.8rem', opacity: 0.5 }}>📊</div>
            )}
        </div>
    </Link>
  );
};
