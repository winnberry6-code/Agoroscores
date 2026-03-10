'use client';

import React from 'react';

interface MomentumPoint {
    minute: number;
    score: number; // -100 to +100
}

interface MomentumGraphProps {
    data: MomentumPoint[];
    homeTeam: string;
    awayTeam: string;
}

export const MomentumGraphView: React.FC<MomentumGraphProps> = ({ data, homeTeam, awayTeam }) => {
    // Determine the max absolute score to scale the Y-axis gracefully
    const maxAbsolute = Math.max(10, ...data.map(p => Math.abs(p.score)));

    return (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Match Momentum</h3>
            
            <div style={{ position: 'relative', height: '140px', width: '100%', borderLeft: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'flex-end', paddingTop: '10px' }}>
                
                {/* Center Zero Line (Home above, Away below) */}
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--border-subtle)', zIndex: 1 }} />
                
                {/* Axis Labels */}
                <span style={{ position: 'absolute', top: '0', left: '-40px', fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{homeTeam.substring(0,3)}</span>
                <span style={{ position: 'absolute', bottom: '0', left: '-40px', fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{awayTeam.substring(0,3)}</span>

                {/* Data Bars */}
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', zIndex: 2, paddingLeft: '8px', gap: '4px' }}>
                    {data.map((point, i) => {
                        // Calculate percentage of half-height
                        const heightPct = (Math.abs(point.score) / maxAbsolute) * 100;
                        const isHome = point.score > 0;
                        
                        return (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                                {/* Top Half (Home) */}
                                <div style={{ height: '50%', width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                                    {isHome && (
                                        <div style={{ 
                                            width: '100%', height: \`\${heightPct}%\`, 
                                            background: 'var(--accent-primary)', 
                                            minHeight: '2px', borderTopLeftRadius: '2px', borderTopRightRadius: '2px' 
                                        }} />
                                    )}
                                </div>
                                {/* Bottom Half (Away) */}
                                <div style={{ height: '50%', width: '100%', display: 'flex', alignItems: 'flex-start' }}>
                                    {!isHome && point.score !== 0 && (
                                        <div style={{ 
                                            width: '100%', height: \`\${heightPct}%\`, 
                                            background: 'var(--status-delayed)', // Amber for away pressure
                                            minHeight: '2px', borderBottomLeftRadius: '2px', borderBottomRightRadius: '2px' 
                                        }} />
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* X-Axis Minute Markers */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', marginLeft: '8px', color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                <span>0'</span>
                <span>45'</span>
                <span>90'</span>
            </div>

            {/* AI Summary Layer */}
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-highlight)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem', display: 'block' }}>✨ AI Analysis</span>
                <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                    {homeTeam} dominating possession but {awayTeam} is relying on rapid counter-attacks, creating heavy pressure swings since the 60th minute.
                </p>
            </div>
        </div>
    );
};
