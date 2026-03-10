'use client';

import React from 'react';

interface SettingsToggleProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export const SettingsToggle: React.FC<SettingsToggleProps> = ({ label, checked, onChange }) => {
    return (
        <>
            <span style={{ fontWeight: 500 }}>{label}</span>
            <button 
                onClick={() => onChange(!checked)}
                style={{
                    position: 'relative',
                    width: '46px',
                    height: '26px',
                    borderRadius: 'var(--radius-full)',
                    background: checked ? 'var(--accent-primary)' : 'var(--bg-highlight)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    outline: 'none'
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: '2px',
                    left: checked ? '22px' : '2px',
                    width: '22px',
                    height: '22px',
                    background: checked ? '#000' : 'var(--text-secondary)',
                    borderRadius: '50%',
                    transition: 'left 0.2s ease-out, background-color 0.2s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} />
            </button>
        </>
    );
};
