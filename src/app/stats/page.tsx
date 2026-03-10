'use client';

import React, { useState } from 'react';
import { TabSwitcher } from '@/components/global/TabSwitcher';
import { StatsMasterTable } from '@/components/stats/StatsMasterTable';
import { CountryAccordion } from '@/components/stats/CountryAccordion';

const MOCK_STANDINGS = [
    { rank: 1, team: 'Arsenal', p: 38, w: 28, d: 5, l: 5, gf: 91, ga: 29, gd: '+62', pts: 89 },
    { rank: 2, team: 'Man City', p: 38, w: 28, d: 7, l: 3, gf: 96, ga: 34, gd: '+62', pts: 91 }, // Just mock context
    { rank: 3, team: 'Liverpool', p: 38, w: 24, d: 10, l: 4, gf: 86, ga: 41, gd: '+45', pts: 82 },
];

const COLUMNS = [
    { key: 'team', label: 'Club', align: 'left', width: '120px' }, // Stickies
    { key: 'p', label: 'P' },
    { key: 'w', label: 'W' },
    { key: 'd', label: 'D' },
    { key: 'l', label: 'L' },
    { key: 'gf', label: 'GF' },
    { key: 'ga', label: 'GA' },
    { key: 'gd', label: 'GD' },
    { key: 'pts', label: 'Pts', align: 'center' },
] as any[];

const MOCK_COUNTRIES = [
    { country: { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' }, leagues: [{ id: 1, name: 'Premier League' }, { id: 2, name: 'Championship' }] },
    { country: { name: 'Spain', flag: '🇪🇸' }, leagues: [{ id: 3, name: 'La Liga' }, { id: 4, name: 'Segunda Division' }] },
    { country: { name: 'Italy', flag: '🇮🇹' }, leagues: [{ id: 5, name: 'Serie A' }] }
];

export default function StatsHub() {
    const [activeTab, setActiveTab] = useState('Leagues');

    return (
        <div style={{ paddingBottom: '80px' }}>
             <div style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(15, 17, 21, 0.9)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                <TabSwitcher 
                    tabs={['Leagues', 'Teams', 'Players', 'Top Scorers', 'xG']} 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                />
            </div>

            <div style={{ padding: '1.5rem' }}>
                {activeTab === 'Leagues' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        {/* Featured Standings View */}
                        <div>
                            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '1.5rem' }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
                                    <h2 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Premier League</h2>
                                </div>
                                <span style={{ color: 'var(--accent-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>Full Table</span>
                            </div>
                            <StatsMasterTable columns={COLUMNS} data={MOCK_STANDINGS} />
                        </div>

                        {/* Global Exploration */}
                        <div>
                            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Browse Worldwide</h3>
                            {MOCK_COUNTRIES.map((group, i) => (
                                <CountryAccordion key={i} country={group.country} leagues={group.leagues} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Provide simple empty states for the rest of the demo tabs */}
                {activeTab !== 'Leagues' && (
                    <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Data Loading</h3>
                        <p>{activeTab} statistics are currently being indexed by the delivery optimizer.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
