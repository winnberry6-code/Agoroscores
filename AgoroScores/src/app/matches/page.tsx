'use client';

import React, { useState } from 'react';
import { TabSwitcher } from '@/components/global/TabSwitcher';
import { DateSelector } from '@/components/matches/DateSelector';
import { MatchStatusBadge } from '@/components/global/LiveBadge';
import Link from 'next/link';

// Extracted MatchRow component specific to V4 Design System
const MatchRow = ({ match }: { match: any }) => (
    <Link href={`/match/${match.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="card hover-scale" style={{
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1rem 1.5rem',
            marginBottom: '0.5rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Status Column */}
            <div style={{ width: '50px', flexShrink: 0 }}>
                <MatchStatusBadge status={match.status} minute={match.minute} />
            </div>

            {/* Teams & Scores Content */}
            <div style={{ flex: 1, paddingRight: '1rem', borderRight: '1px solid var(--border-subtle)' }}>
                {/* Home Row */}
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '20px', height: '20px', background: 'var(--bg-highlight)', borderRadius: '50%', textAlign: 'center', fontSize: '12px' }}>{match.home.icon}</div>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{match.home.name}</span>
                        {match.home.redCards > 0 && <span style={{ width: '8px', height: '12px', background: 'var(--event-red-card)', borderRadius: '2px', display: 'inline-block' }}></span>}
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.125rem', color: match.status === 'NS' ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>
                        {match.status === 'NS' ? '-' : match.home.score}
                    </span>
                </div>
                
                {/* Away Row */}
                <div className="flex-between">
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '20px', height: '20px', background: 'var(--bg-highlight)', borderRadius: '50%', textAlign: 'center', fontSize: '12px' }}>{match.away.icon}</div>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{match.away.name}</span>
                        {match.away.redCards > 0 && <span style={{ width: '8px', height: '12px', background: 'var(--event-red-card)', borderRadius: '2px', display: 'inline-block' }}></span>}
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.125rem', color: match.status === 'NS' ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>
                        {match.status === 'NS' ? '-' : match.away.score}
                    </span>
                </div>
            </div>

            {/* Action Column */}
            <div style={{ width: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-tertiary)', fontSize: '1.25rem' }}>
                {match.isFavorite ? '⭐️' : '☆'}
            </div>
        </div>
    </Link>
);


const MOCK_LEAGUES = [
    {
        id: '1', name: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        matches: [
            { id: '101', status: 'LIVE', minute: 67, isFavorite: true, home: { name: 'Arsenal', score: 2, icon: 'A', redCards: 0 }, away: { name: 'Chelsea', score: 1, icon: 'C', redCards: 1 } },
            { id: '102', status: 'HT', minute: 45, isFavorite: false, home: { name: 'Man City', score: 0, icon: 'M', redCards: 0 }, away: { name: 'Liverpool', score: 0, icon: 'L', redCards: 0 } }
        ]
    },
    {
        id: '2', name: 'La Liga', country: '🇪🇸',
        matches: [
            { id: '201', status: 'NS', minute: 0, isFavorite: false, home: { name: 'Real Madrid', score: 0, icon: 'R', redCards: 0 }, away: { name: 'Barcelona', score: 0, icon: 'B', redCards: 0 } }
        ]
    }
];

export default function MatchesHub() {
    const [activeTab, setActiveTab] = useState('All');
    const [selectedDate, setSelectedDate] = useState(new Date());

    return (
        <div style={{ paddingBottom: '80px' }}>
            <TabSwitcher tabs={['All', 'Live', 'Upcoming', 'Finished']} activeTab={activeTab} onTabChange={setActiveTab} />
            
            {/* Conditional Date Selector - Hides on 'Live' tab because Live implies today */}
            {activeTab !== 'Live' && (
                <DateSelector selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            )}

            {/* Filter Drawer Handle */}
            <div className="flex-between" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Showing {activeTab} Matches</span>
                <button className="btn" style={{ background: 'var(--bg-elevated)', border: 'none', color: 'var(--text-primary)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                    Filters
                </button>
            </div>

            {/* List Engine */}
            <div style={{ padding: '1.5rem' }}>
                {MOCK_LEAGUES.map(league => (
                    <div key={league.id} style={{ marginBottom: '2rem' }}>
                        {/* League Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '1.25rem' }}>{league.country}</span>
                            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>{league.name}</h2>
                            <span style={{ cursor: 'pointer', color: 'var(--text-tertiary)', marginLeft: 'auto' }}>›</span>
                        </div>

                        {/* Matches */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {league.matches.map(match => (
                                <MatchRow key={match.id} match={match} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
