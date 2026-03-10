'use client';

import React from 'react';

// Generates an array from T-5 to T+7
function generateDates() {
    const dates = [];
    const today = new Date();
    today.setHours(0,0,0,0);
    
    for (let i = -5; i <= 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dates.push(d);
    }
    return dates;
}

export const DateSelector = ({ selectedDate, onSelectDate }: { selectedDate: Date, onSelectDate: (d: Date) => void }) => {
    const dates = generateDates();
    const todayStr = new Date().toDateString();

    return (
        <div style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            padding: '1rem 1.5rem',
            background: 'var(--bg-main)',
            borderBottom: '1px solid var(--border-subtle)',
            scrollbarWidth: 'none'
        }}>
            {dates.map((date, idx) => {
                const isSelected = date.toDateString() === selectedDate.toDateString();
                const isToday = date.toDateString() === todayStr;
                
                const weekDay = date.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = date.getDate();

                return (
                    <button
                        key={idx}
                        onClick={() => onSelectDate(date)}
                        className="hover-scale"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '55px',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-lg)',
                            border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'transparent'}`,
                            background: isSelected ? 'rgba(0, 230, 118, 0.1)' : 'var(--bg-elevated)',
                            cursor: 'pointer',
                            color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)'
                        }}
                    >
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>
                            {isToday ? 'TODAY' : weekDay}
                        </span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                            {dayNum}
                        </span>
                    </button>
                );
            })}
             <style dangerouslySetInnerHTML={{__html: `button::-webkit-scrollbar { display: none; }`}} />
        </div>
    );
};
