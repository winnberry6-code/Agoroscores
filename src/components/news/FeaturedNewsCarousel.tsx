'use client';

import React from 'react';

export const FeaturedNewsCarousel = ({ stories }: { stories: any[] }) => {
    return (
        <div style={{ padding: '1rem 0', marginBottom: '1rem' }}>
            <h2 style={{ padding: '0 1.5rem', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 800 }}>Top Stories</h2>
            <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                overflowX: 'auto', 
                padding: '0 1.5rem',
                scrollbarWidth: 'none',
                snapType: 'x mandatory'
            }}>
                {stories.map(story => (
                    <div 
                        key={story.id} 
                        className="card hover-scale" 
                        style={{ 
                            minWidth: '280px', 
                            maxWidth: '85vw',
                            height: '320px', 
                            position: 'relative', 
                            overflow: 'hidden',
                            flexShrink: 0,
                            snapAlign: 'center'
                        }}
                    >
                        {/* Simulated Image Background */}
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: `url(${story.imageUrl}) center/cover no-repeat`,
                            backgroundColor: 'var(--bg-highlight)' // Fallback
                        }} />
                        
                        {/* Gradient Overlay for text readability */}
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'linear-gradient(to top, rgba(15,17,21,1) 0%, rgba(15,17,21,0.4) 50%, rgba(15,17,21,0) 100%)'
                        }} />

                        {/* Content Area */}
                        <div style={{
                            position: 'absolute',
                            bottom: 0, left: 0, right: 0,
                            padding: '1.25rem'
                        }}>
                             <div style={{ 
                                display: 'inline-block',
                                background: 'var(--accent-primary)', 
                                color: '#000', 
                                padding: '2px 8px', 
                                borderRadius: '4px', 
                                fontSize: '0.65rem', 
                                fontWeight: 800, 
                                textTransform: 'uppercase',
                                marginBottom: '0.5rem',
                                letterSpacing: '0.5px'
                            }}>
                                {story.category}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.5rem' }}>
                                {story.title}
                            </h3>
                            <div className="flex-between" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                <span>{story.source}</span>
                                <span>{story.timeAgo}</span>
                            </div>
                        </div>
                    </div>
                ))}
                 <style dangerouslySetInnerHTML={{__html: `div::-webkit-scrollbar { display: none; }`}} />
            </div>
        </div>
    );
};
