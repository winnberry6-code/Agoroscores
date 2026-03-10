'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ChatMessage {
    id: string;
    username: string;
    content: string;
    timestamp: string;
    isPremium: boolean;
}

export const LiveDiscussionRoom = ({ matchId }: { matchId: string }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [intensity, setIntensity] = useState('🔥 85% Intense');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Mock initial load
    useEffect(() => {
        setMessages([
            { id: '1', username: 'Gunner99', content: 'What a game! They cannot deal with Saka.', timestamp: '12:05', isPremium: true },
            { id: '2', username: 'CFC_Tom', content: 'We need to make a sub ASAP before we concede again.', timestamp: '12:06', isPremium: false },
        ]);
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        
        const newMsg: ChatMessage = {
            id: Date.now().toString(),
            username: 'You',
            content: inputValue,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isPremium: true
        };
        
        setMessages(prev => [...prev, newMsg]);
        setInputValue('');
    };

    const EMOJIS = ['🔥', '😱', '🥱', '⚽', '🟥'];

    return (
        <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', overflow: 'hidden', height: '400px', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header */}
            <div className="flex-between" style={{ padding: '0.75rem 1rem', background: 'var(--bg-main)', borderBottom: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0 }}>Live Fan Zone</h3>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--status-live)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-live)' }} />
                    {intensity}
                </div>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                {messages.map(msg => (
                    <div key={msg.id} style={{ display: 'flex', gap: '0.5rem' }}>
                        <span style={{ 
                            fontWeight: 700, 
                            color: msg.isPremium ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            minWidth: '60px'
                        }}>
                            {msg.username}:
                        </span>
                        <span style={{ color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                            {msg.content}
                        </span>
                    </div>
                ))}
            </div>

            {/* Reactions Bar */}
            <div style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', borderTop: '1px solid var(--border-subtle)' }}>
                {EMOJIS.map(emoji => (
                    <button key={emoji} className="hover-scale" style={{ 
                        background: 'var(--bg-highlight)', border: 'none', borderRadius: 'var(--radius-md)', 
                        padding: '0.5rem', fontSize: '1.25rem', cursor: 'pointer', flexShrink: 0
                    }}>
                        {emoji}
                    </button>
                ))}
            </div>

            {/* Input Area */}
            <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-main)', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem' }}>
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Join the discussion..." 
                    style={{ flex: 1, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-full)', padding: '0.5rem 1rem', color: 'var(--text-primary)', outline: 'none' }} 
                />
            </div>
        </div>
    );
};
