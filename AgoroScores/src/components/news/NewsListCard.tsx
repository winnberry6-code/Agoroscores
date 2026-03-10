'use client';

import React from 'react';

export const NewsListCard = ({ article }: { article: any }) => {
    return (
        <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            padding: '1rem 0',
            borderBottom: '1px solid var(--border-subtle)'
        }}>
            {/* Thumbnail */}
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-elevated)',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
            }}>
                📰
            </div>

            {/* Content Column */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ 
                    color: 'var(--accent-secondary)', 
                    fontSize: '0.65rem', 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.5px',
                    marginBottom: '0.25rem'
                }}>
                    {article.category}
                </span>
                
                <h4 style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: 600, 
                    lineHeight: 1.3, 
                    margin: 0,
                    color: 'var(--text-primary)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {article.title}
                </h4>

                <div className="flex-between" style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    <span>{article.source} • {article.timeAgo}</span>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
