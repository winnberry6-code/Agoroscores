'use client';

import React, { useState } from 'react';
import { TabSwitcher } from '@/components/global/TabSwitcher';
import { MatchStatusBadge } from '@/components/global/LiveBadge';
import { EmptyState } from '@/components/UXStates';

// --- Sub-Components ---

const TimelineEventItem = ({ event }: { event: any }) => {
    const isHome = event.team === 'home';
    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', position: 'relative' }}>
            {/* Center vertical line */}
            <div style={{ position: 'absolute', left: '50%', top: '24px', bottom: '-24px', width: '2px', background: 'var(--border-subtle)', transform: 'translateX(-50%)' }}></div>
            
            {/* Home Side */}
            <div style={{ flex: 1, textAlign: 'right', paddingRight: '1.5rem' }}>
                {isHome && (
                    <>
                        <div style={{ fontWeight: 700 }}>{event.player}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{event.detail}</div>
                    </>
                )}
            </div>
            
            {/* Center Icon */}
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-elevated)', border: `2px solid ${event.isVar ? 'var(--event-var)' : 'var(--border-subtle)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                {event.icon}
            </div>

            {/* Away Side */}
            <div style={{ flex: 1, paddingLeft: '1.5rem' }}>
                {!isHome && (
                    <>
                        <div style={{ fontWeight: 700 }}>{event.player} <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>{event.minute}'</span></div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{event.detail}</div>
                    </>
                )}
            </div>
        </div>
    );
};

const StatsComparisonRow = ({ label, home, away, isPercentage = false }: { label: string, home: number, away: number, isPercentage?: boolean }) => {
    const total = home + away || 1;
    const homePercent = (home / total) * 100;
    
    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <div className="flex-between" style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                <strong style={{ color: home > away ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{isPercentage ? `${home}%` : home}</strong>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
                <strong style={{ color: away > home ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{isPercentage ? `${away}%` : away}</strong>
            </div>
            <div style={{ display: 'flex', height: '6px', borderRadius: 'var(--radius-full)', overflow: 'hidden', background: 'var(--bg-elevated)' }}>
                <div style={{ width: `${homePercent}%`, background: home > away ? 'var(--accent-primary)' : 'var(--border-subtle)' }}></div>
                <div style={{ width: `${100 - homePercent}%`, background: away > home ? 'var(--accent-primary)' : 'var(--border-subtle)' }}></div>
            </div>
        </div>
    );
};

// --- Main Page Component ---

export default function MatchDetailsPage({ params }: { params: { id: string } }) {
    const [activeTab, setActiveTab] = useState('Overview');

    // MOCK DATA
    const match = {
        status: 'LIVE', minute: 72, isStale: false,
        competition: 'Premier League', round: 'Matchday 12',
        home: { name: 'Arsenal', icon: 'A', score: 2 },
        away: { name: 'Chelsea', icon: 'C', score: 1 },
        hasPremiumStats: true,
        events: [
            { id: 1, type: 'goal', minute: 14, team: 'home', player: 'Saka', detail: 'Assist: Ødegaard', icon: '⚽', isVar: false },
            { id: 2, type: 'yellow', minute: 32, team: 'away', player: 'Caicedo', detail: 'Foul', icon: '🟨', isVar: false },
            { id: 3, type: 'goal', minute: 45, team: 'away', player: 'Jackson', detail: 'Assist: Palmer', icon: '⚽', isVar: false },
            { id: 4, type: 'goal', minute: 61, team: 'home', player: 'Martinelli', detail: 'VAR Confirmed', icon: '⚽', isVar: true },
        ],
        stats: {
            possession: { h: 58, a: 42 },
            shots: { h: 14, a: 7 },
            shotsOnTarget: { h: 6, a: 3 },
            xg: { h: 1.84, a: 0.92 }
        }
    };

    return (
        <div style={{ paddingBottom: '80px' }}>
            {/* Parallax Hero Scoreboard */}
            <div style={{
                background: 'linear-gradient(180deg, var(--bg-highlight) 0%, var(--bg-main) 100%)',
                padding: '3rem 1.5rem 2rem 1.5rem',
                textAlign: 'center',
                borderBottom: '1px solid var(--border-subtle)'
            }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>
                    {match.competition} • {match.round}
                </div>

                <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                    {/* Home Team */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '0.75rem' }}>
                            {match.home.icon}
                        </div>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{match.home.name}</h2>
                    </div>

                    {/* Score Center */}
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-2px', marginBottom: '0.5rem' }}>
                            {match.home.score} - {match.away.score}
                        </div>
                        <div className="flex-center">
                            <MatchStatusBadge status={match.status} minute={match.minute} isStale={match.isStale} />
                        </div>
                    </div>

                    {/* Away Team */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                         <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '0.75rem' }}>
                            {match.away.icon}
                        </div>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{match.away.name}</h2>
                    </div>
                </div>
            </div>

            {/* Sticky Navigation Tabs */}
            <div style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(15, 17, 21, 0.9)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                <TabSwitcher 
                    tabs={['Overview', 'Events', 'Stats', 'Lineups', 'Standings']} 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                />
            </div>

            {/* Tab Content Engine */}
            <div style={{ padding: '2rem 1.5rem' }}>
                
                {/* OVERVIEW TAB */}
                {activeTab === 'Overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* AI Summary Block */}
                        <div className="card" style={{ padding: '1.5rem', borderLeft: '3px solid var(--accent-secondary)' }}>
                            <h3 style={{ fontSize: '0.875rem', color: 'var(--accent-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                ✨ AI Match Summary
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                                Arsenal dominating possession early. Martinelli's VAR-confirmed goal at 61' puts them ahead following Jackson's equalizer just before the half.
                            </p>
                        </div>
                        
                        {/* High-level stats preview */}
                        <div>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>Match Momentum</h3>
                            <StatsComparisonRow label="Possession" home={match.stats.possession.h} away={match.stats.possession.a} isPercentage />
                            <StatsComparisonRow label="Shots on Target" home={match.stats.shotsOnTarget.h} away={match.stats.shotsOnTarget.a} />
                        </div>
                    </div>
                )}

                {/* EVENTS TAB */}
                {activeTab === 'Events' && (
                    <div>
                        <h3 style={{ marginBottom: '2rem', fontSize: '1.125rem', textAlign: 'center' }}>Match Timeline</h3>
                        {match.events.map(ev => <TimelineEventItem key={ev.id} event={ev} />)}
                    </div>
                )}

                {/* STATS TAB */}
                {activeTab === 'Stats' && (
                    <div>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>Team Statistics</h3>
                        
                        <div className="card" style={{ padding: '1.5rem' }}>
                            <StatsComparisonRow label="Possession" home={match.stats.possession.h} away={match.stats.possession.a} isPercentage />
                            <StatsComparisonRow label="Total Shots" home={match.stats.shots.h} away={match.stats.shots.a} />
                            <StatsComparisonRow label="Shots on Target" home={match.stats.shotsOnTarget.h} away={match.stats.shotsOnTarget.a} />
                            
                            {/* Graceful Degradation Pattern */}
                            {match.hasPremiumStats ? (
                                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                                    <div style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '1rem', letterSpacing: '1px' }}>Advanced Metrics</div>
                                    <StatsComparisonRow label="Expected Goals (xG)" home={match.stats.xg.h} away={match.stats.xg.a} />
                                </div>
                            ) : (
                                <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                    Advanced metrics (xG) are not available for this competition.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* LINEUPS TAB (Empty State Demo) */}
                {activeTab === 'Lineups' && (
                     <EmptyState 
                        title="Lineups Confirmed Soon" 
                        description="Starting XIs and formations are typically announced 60 minutes before kickoff."
                        icon="👕"
                     />
                )}

                 {/* STANDINGS TAB (Empty State Demo) */}
                {activeTab === 'Standings' && (
                     <EmptyState 
                        title="No Standings Data" 
                        description="League tables are unavailable for cup or exhibition matches."
                        icon="🏆"
                     />
                )}

            </div>
        </div>
    );
}
