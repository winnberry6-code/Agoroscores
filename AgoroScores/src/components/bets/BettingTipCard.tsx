'use client';

import React from 'react';

interface TipCardProps {
    tip: any;
    userHasPremium: boolean;
}

export const BettingTipCard: React.FC<TipCardProps> = ({ tip, userHasPremium }) => {
    const isLocked = tip.isPremium && !userHasPremium;

    return (
        <div className="card hover-scale" style={{ marginBottom: '1rem', overflow: 'hidden' }}>
            {/* Header: Match Context */}
            <div className="flex-between" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{tip.kickoffTime}</span>
                    <span style={{ fontWeight: 700 }}>{tip.home} vs {tip.away}</span>
                </div>
                <div style={{ background: 'var(--bg-main)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>
                    {tip.market}
                </div>
            </div>

            {/* Body: Prediction & AI Explanation */}
            <div style={{ padding: '1.5rem', position: 'relative' }}>
                
                {/* Visual Logic for Locked Content */}
                <div style={{ 
                    filter: isLocked ? 'blur(8px)' : 'none', 
                    opacity: isLocked ? 0.3 : 1,
                    transition: 'filter 0.3s'
                }}>
                    <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.5rem', lineHeight: 1 }}>
                        {tip.prediction}
                    </h3>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Confidence:</span>
                        <div style={{ flex: 1, height: '6px', background: 'var(--bg-main)', borderRadius: 'var(--radius-full)' }}>
                            <div style={{ width: `${tip.confidence}%`, height: '100%', background: 'var(--accent-primary)', borderRadius: 'var(--radius-full)' }}></div>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{tip.confidence}%</span>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                        <strong style={{ color: 'var(--text-primary)' }}>AI Analysis:</strong> {tip.explanation}
                    </p>
                </div>

                {/* Premium Lock Overlay */}
                {isLocked && (
                    <div className="flex-center" style={{ 
                        position: 'absolute', 
                        top: 0, left: 0, right: 0, bottom: 0, 
                        flexDirection: 'column',
                        gap: '0.75rem',
                        zIndex: 10 
                    }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                            🔒
                        </div>
                        <h4 style={{ margin: 0, fontSize: '1.125rem' }}>Premium Insights</h4>
                        <button className="btn hover-scale" style={{ 
                            background: 'var(--accent-primary)', 
                            color: '#000', 
                            border: 'none', 
                            padding: '0.5rem 1.5rem', 
                            borderRadius: 'var(--radius-full)', 
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}>
                            Unlock Analysis
                        </button>
                    </div>
                )}
            </div>
            
            {/* Status Footer (If historical) */}
            {tip.status && tip.status !== 'pending' && (
                <div style={{ 
                    padding: '0.75rem 1.5rem', 
                    background: tip.status === 'won' ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                    color: tip.status === 'won' ? 'var(--accent-primary)' : 'var(--status-live)',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    textAlign: 'center',
                    textTransform: 'uppercase'
                }}>
                    Tip {tip.status}
                </div>
            )}
        </div>
    );
};
