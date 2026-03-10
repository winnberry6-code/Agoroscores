'use client';

import React, { useState } from 'react';
import { TabSwitcher } from '@/components/global/TabSwitcher';
import { BettingTipCard } from '@/components/bets/BettingTipCard';

// MOCK DATA matching the Admin Dashboard structures
const MOCK_TIPS = [
    { 
        id: '1', home: 'Arsenal', away: 'Chelsea', kickoffTime: 'Today, 20:00', market: 'Over/Under Goals', 
        prediction: 'Over 2.5 Goals', confidence: 85, isPremium: false, status: 'pending',
        explanation: 'Arsenal has scored 12 goals in their last 3 home matches. Chelsea defense continues to struggle with set pieces.' 
    },
    { 
        id: '2', home: 'Real Madrid', away: 'Barcelona', kickoffTime: 'Tomorrow, 21:00', market: 'Match Result', 
        prediction: 'Real Madrid to Win', confidence: 92, isPremium: true, status: 'pending',
        explanation: 'Madrid rests 5 key players midweek. Barcelona is missing Pedri and Gavi with an xG differential of -1.2 on the road.' 
    },
    { 
        id: '3', home: 'Bayern', away: 'Dortmund', kickoffTime: 'Yesterday', market: 'Both Teams To Score', 
        prediction: 'Yes', confidence: 80, isPremium: false, status: 'won',
        explanation: 'Historically this fixture yields 4.2 goals on average. Neither team has kept a clean sheet in 5 matches.' 
    }
];

export default function BetsHub() {
    const [activeTab, setActiveTab] = useState('Free Tips');
    const [userHasPremium, setUserHasPremium] = useState(false); // Toggle to test UI states

    const filteredTips = MOCK_TIPS.filter(tip => {
        if (activeTab === 'Results') return tip.status !== 'pending';
        if (activeTab === 'Premium Tips') return tip.isPremium === true && tip.status === 'pending';
        return tip.isPremium === false && tip.status === 'pending'; // Free Tips default
    });

    return (
        <div style={{ paddingBottom: '80px' }}>
            <div style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(15, 17, 21, 0.9)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                <TabSwitcher 
                    tabs={['Free Tips', 'Premium Tips', 'Results', 'Analysis']} 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                />
            </div>

            {/* Development Toggle */}
            <div style={{ padding: '1rem 1.5rem', background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={userHasPremium} onChange={(e) => setUserHasPremium(e.target.checked)} />
                    Simulate User has Premium Subscription
                </label>
            </div>

            <div style={{ padding: '1.5rem' }}>
                
                {/* Header Context */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{activeTab}</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                        {activeTab === 'Premium Tips' ? 'Exclusive AI-assisted mathematical predictions.' : 'Mathematical projections for major upcoming fixtures.'}
                    </p>
                </div>

                {/* List Engine */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {filteredTips.length > 0 ? (
                        filteredTips.map(tip => (
                            <BettingTipCard key={tip.id} tip={tip} userHasPremium={userHasPremium} />
                        ))
                    ) : (
                        <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯</div>
                            <p>No tips available in this section currently.</p>
                        </div>
                    )}
                </div>

                {/* Editorial Disclaimer */}
                <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,149,0,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--status-delayed)', fontSize: '0.75rem', textAlign: 'center', lineHeight: 1.5 }}>
                    <strong>Disclaimer:</strong> AgoroScores AI analysis does not constitute financial advice. Please gamble responsibly.
                </div>
            </div>
        </div>
    );
}
