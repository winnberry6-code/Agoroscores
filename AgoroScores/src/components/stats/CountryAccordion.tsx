'use client';

import React, { useState } from 'react';

export const CountryAccordion = ({ country, leagues }: { country: any, leagues: any[] }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ marginBottom: '0.5rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'var(--text-primary)', 
                    cursor: 'pointer' 
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{country.flag}</span>
                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>{country.name}</span>
                </div>
                <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
            </button>
            
            {isOpen && (
                <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    {leagues.map(league => (
                        <div key={league.id} className="hover-scale" style={{ padding: '0.75rem 1rem 0.75rem 3rem', cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.875rem' }}>{league.name}</span>
                            <span style={{ color: 'var(--text-tertiary)', fontSize: '1.2rem' }}>›</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
