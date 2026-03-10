'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Mocked structured data for the Premium Home Page
const MOCK_DATA = {
    layoutOrder: ['LIVE_HERO', 'MAJOR_LEAGUES', 'TRENDING_NEWS'], // Simulated from Gemini FeedRankingService
    liveHero: { id: '304', home: 'Arsenal', away: 'Chelsea', homeScore: 2, awayScore: 1, minute: 84 },
    leagues: [
        { id: '1', name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', liveCount: 3 },
        { id: '2', name: 'La Liga', flag: '🇪🇸', liveCount: 1 },
        { id: '3', name: 'Champions League', flag: '🇪🇺', liveCount: 0 },
    ],
    news: [
        { id: '101', title: 'Mbappe confirms Real Madrid transfer', summary: 'The highly anticipated free transfer is set to be announced next week.', image: '🔄', tag: 'Transfer' },
        { id: '102', title: 'Man City face potential points deduction', summary: 'The ongoing hearing has reached its final week of testimonies.', image: '⚖️', tag: 'Breaking' }
    ]
};

const QuickFilters = () => {
    const filters = ['Live', 'Today', 'Upcoming', 'Finished', 'Favorites', 'Major Leagues'];
    return (
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', padding: '1rem 1.5rem', scrollbarWidth: 'none' }}>
            {filters.map((f, i) => (
                <button key={f} className={`btn ${i === 0 ? 'pulse-live-container' : ''}`} style={{
                    padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap',
                    background: i === 0 ? 'var(--text-primary)' : 'var(--bg-elevated)', border: 'none',
                    color: i === 0 ? 'var(--bg-main)' : 'var(--text-primary)', fontWeight: i === 0 ? 700 : 500
                }}>
                    {i === 0 && <span className="pulse-live" style={{ marginRight: '6px', background: 'var(--bg-main)' }}></span>}
                    {f}
                </button>
            ))}
             <style dangerouslySetInnerHTML={{__html: `div::-webkit-scrollbar { display: none; }`}} />
        </div>
    );
};

const LiveHeroTracker = ({ match }: any) => (
    <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-live"></span> MOST ACTIVE NOW
        </h3>
        <Link href={`/match/${match.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card hover-scale" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-highlight) 100%)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--status-live)', fontWeight: 700, fontSize: '0.875rem' }}>{match.minute}'</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', background: 'var(--bg-main)', padding: '2px 6px', borderRadius: '4px' }}>Premier League</span>
                </div>
                <div className="flex-between" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    <div style={{ flex: 1 }}>{match.home}</div>
                    <div style={{ width: '60px', textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px' }}>
                        {match.homeScore} - {match.awayScore}
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>{match.away}</div>
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--accent-primary)', textAlign: 'center' }}>
                    Tap to view Match Center →
                </div>
            </div>
        </Link>
    </div>
);

const MajorLeaguesRow = ({ leagues }: any) => (
    <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ padding: '0 1.5rem', fontSize: '1.125rem', marginBottom: '1rem' }}>Major Competitions</h3>
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', padding: '0 1.5rem', scrollbarWidth: 'none' }}>
            {leagues.map((l: any) => (
                <div key={l.id} className="card hover-scale" style={{ minWidth: '140px', padding: '1rem', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{l.flag}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>{l.name}</div>
                    {l.liveCount > 0 ? (
                        <div style={{ color: 'var(--status-live)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                             <span className="pulse-live"></span> {l.liveCount} Live
                        </div>
                    ) : (
                        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Offseason</div>
                    )}
                </div>
            ))}
            <style dangerouslySetInnerHTML={{__html: `div::-webkit-scrollbar { display: none; }`}} />
        </div>
    </div>
);

const TrendingNewsList = ({ news }: any) => (
    <div style={{ padding: '0 1.5rem', marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Trending News
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>See All</span>
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {news.map((item: any) => (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                        {item.image}
                    </div>
                    <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: 800, letterSpacing: '0.5px' }}>{item.tag}</span>
                        <h4 style={{ margin: '0.25rem 0', fontSize: '0.9rem', lineHeight: 1.3 }}>{item.title}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>{item.summary}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default function HomePage() {
    return (
        <div style={{ paddingBottom: '80px' }}>
            <QuickFilters />

            {/* AI-Derived Layout Order applied dynamically */}
            {MOCK_DATA.layoutOrder.map(block => {
                if (block === 'LIVE_HERO') return <LiveHeroTracker key={block} match={MOCK_DATA.liveHero} />;
                if (block === 'MAJOR_LEAGUES') return <MajorLeaguesRow key={block} leagues={MOCK_DATA.leagues} />;
                if (block === 'TRENDING_NEWS') return <TrendingNewsList key={block} news={MOCK_DATA.news} />;
                return null;
            })}
        </div>
    );
}
