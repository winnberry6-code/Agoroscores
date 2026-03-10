'use client';

import React from 'react';

export const SettingsRowGroup = ({ title, children }: { title: string, children: React.ReactNode }) => {
    return (
        <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '1px', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>
                {title}
            </h3>
            <div style={{ 
                background: 'var(--bg-elevated)', 
                borderRadius: 'var(--radius-lg)', 
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden'
            }}>
                {React.Children.map(children, (child, index) => (
                    <div style={{ 
                        borderBottom: index !== React.Children.count(children) - 1 ? '1px solid var(--border-subtle)' : 'none',
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '1rem',
                        color: 'var(--text-primary)'
                    }}>
                        {child}
                    </div>
                ))}
            </div>
        </div>
    );
};
