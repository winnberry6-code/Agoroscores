'use client';

import React from 'react';

interface InsightProps {
    title: string;
    text: string;
    teamId: string;
}

export const PersonalizedInsightCard: React.FC<InsightProps> = ({ title, text, teamId }) => {
    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(15, 17, 21, 1) 0%, rgba(30, 36, 45, 1) 100%)',
            border: '1px solid rgba(0, 230, 118, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '1rem'
        }}>
            {/* Sparkle Icon */}
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '4rem', opacity: 0.05, filter: 'blur(2px)' }}>✨</div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem' }}>✨</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Live Match Insight
                </span>
            </div>
            
            <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, marginBottom: '0.25rem', color: '#fff' }}>
                {title}
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {text}
            </p>
        </div>
    );
};
