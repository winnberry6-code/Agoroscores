'use client';

import React, { useState } from 'react';
import { TabSwitcher } from '@/components/global/TabSwitcher';
import { FeaturedNewsCarousel } from '@/components/news/FeaturedNewsCarousel';
import { NewsListCard } from '@/components/news/NewsListCard';

const MOCK_FEATURED = [
    { id: '1', title: 'Mbappe confirms Real Madrid summer transfer', category: 'Transfer', source: 'Fabrizio Romano', timeAgo: '2h ago', imageUrl: '/mock-assets/mbappe.jpg' },
    { id: '2', title: 'Man City face potential points deduction as hearing concludes', category: 'Breaking', source: 'The Athletic', timeAgo: '5h ago', imageUrl: '/mock-assets/city.jpg' },
    { id: '3', title: 'Arsenal vs Chelsea: Tactical Preview', category: 'Matchday', source: 'Agoro Editorial', timeAgo: '6h ago', imageUrl: '/mock-assets/tactics.jpg' }
];

const MOCK_FEED = [
    { id: '101', title: 'Ten Hag under pressure after heavy defeat at Old Trafford', category: 'Club News', source: 'Sky Sports', timeAgo: '1h ago' },
    { id: '102', title: 'Bellingham ruled out for 3 weeks with ankle sprain', category: 'Injury', source: 'Marca', timeAgo: '3h ago' },
    { id: '103', title: 'Saudi Pro League preparations for massive summer window', category: 'Transfer', source: 'ESPN', timeAgo: '4h ago' },
    { id: '104', title: 'Champions League Format Changes Explained', category: 'League', source: 'UEFA', timeAgo: '8h ago' },
    { id: '105', title: 'Salah hints at potential contract extension', category: 'Player News', source: 'Liverpool Echo', timeAgo: '12h ago' },
];

export default function NewsHub() {
    const [activeCategory, setActiveCategory] = useState('All');
    
    // In a real app, this filters the MOCK_FEED based on the Gemini 'category' tags
    const filteredFeed = activeCategory === 'All' 
        ? MOCK_FEED 
        : MOCK_FEED.filter(article => article.category.includes(activeCategory) || activeCategory.includes(article.category.split(' ')[0]));

    return (
        <div style={{ paddingBottom: '80px' }}>
             {/* Sticky Navigation Tabs */}
             <div style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(15, 17, 21, 0.9)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                <TabSwitcher 
                    tabs={['All', 'Transfers', 'Matchday', 'Previews', 'League', 'Club']} 
                    activeTab={activeCategory} 
                    onTabChange={setActiveCategory} 
                />
            </div>

            {/* Featured Hero Carousel section - Hide if we are specifically filtering down */}
            {activeCategory === 'All' && (
                <>
                    <FeaturedNewsCarousel stories={MOCK_FEATURED} />
                    <div style={{ height: '8px', background: 'var(--bg-elevated)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }} />
                </>
            )}

            {/* Standard News Feed */}
            <div style={{ padding: '1.5rem' }}>
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Latest Updates</h2>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Auto-updating</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {filteredFeed.length > 0 ? (
                        filteredFeed.map(article => (
                            <NewsListCard key={article.id} article={article} />
                        ))
                    ) : (
                        <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📭</div>
                            <p>No new articles in this category.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
