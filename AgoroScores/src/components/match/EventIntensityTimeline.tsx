'use client';

import React from 'react';

interface TimelineEvent {
    minute: number;
    type: 'GOAL' | 'RED_CARD' | 'YELLOW_CARD' | 'VAR' | 'CHANCE';
    team: 'home' | 'away';
}

export const EventIntensityTimeline = ({ events }: { events: TimelineEvent[] }) => {
    return (
        <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Event Intensity
            </h4>
            
            <div style={{ position: 'relative', width: '100%', height: '32px', display: 'flex', alignItems: 'center' }}>
                {/* Base Timeline Bar */}
                <div style={{ position: 'absolute', width: '100%', height: '4px', background: 'var(--bg-highlight)', borderRadius: '2px' }} />
                
                {/* Event Markers Overlaid */}
                {events.map((event, i) => {
                    const leftPos = \`\${(event.minute / 90) * 100}%\`;
                    
                    let bgColor = 'var(--text-tertiary)';
                    let height = '8px';
                    
                    if (event.type === 'GOAL') {
                        bgColor = 'var(--accent-primary)';
                        height = '16px';
                    } else if (event.type === 'RED_CARD') {
                        bgColor = '#ff3b30'; // red
                        height = '16px';
                    } else if (event.type === 'YELLOW_CARD') {
                        bgColor = '#ffcc00'; // yellow
                        height = '12px';
                    } else if (event.type === 'VAR') {
                        bgColor = 'var(--accent-secondary)';
                        height = '16px';
                    }

                    return (
                        <div key={i} style={{
                            position: 'absolute',
                            left: leftPos,
                            width: '4px',
                            height: height,
                            background: bgColor,
                            borderRadius: '2px',
                            transform: 'translateX(-50%)',
                            zIndex: event.type === 'GOAL' || event.type === 'RED_CARD' ? 10 : 5 // Important events render on top
                        }} />
                    )
                })}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', color: 'var(--text-tertiary)', fontSize: '0.65rem' }}>
                <span>0'</span><span>HT</span><span>90'</span>
            </div>
        </div>
    );
};
