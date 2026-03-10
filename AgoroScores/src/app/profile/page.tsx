'use client';

import React, { useState } from 'react';
import { SettingsRowGroup } from '@/components/profile/SettingsRowGroup';
import { SettingsToggle } from '@/components/profile/SettingsToggle';

export default function ProfileHub() {
    const [pushGoals, setPushGoals] = useState(true);
    const [pushRedCards, setPushRedCards] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

    return (
        <div style={{ paddingBottom: '90px', padding: '1.5rem' }}>
            
            {/* User Hero Section */}
            <div className="card" style={{ padding: '2rem 1.5rem', textAlign: 'center', marginBottom: '2.5rem', borderTop: '4px solid var(--accent-primary)' }}>
                <div style={{ 
                    width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-highlight)', 
                    margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontSize: '2.5rem', border: '2px solid var(--border-subtle)' 
                }}>
                    A
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Agoro User</h2>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>user@agoroscores.com</div>
                
                <div style={{ display: 'inline-block', background: 'rgba(0, 230, 118, 0.15)', color: 'var(--accent-primary)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(0, 230, 118, 0.3)' }}>
                    PREMIUM ACTIVE
                </div>
            </div>

            {/* Notification Preferences */}
            <SettingsRowGroup title="Live Notifications">
                <SettingsToggle label="Goals & Assists" checked={pushGoals} onChange={setPushGoals} />
                <SettingsToggle label="Red Cards" checked={pushRedCards} onChange={setPushRedCards} />
                <>
                    <span style={{ fontWeight: 500 }}>Favorite Team Setup</span>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '1.2rem', cursor: 'pointer' }}>›</span>
                </>
            </SettingsRowGroup>

            {/* Content & Preferences */}
            <SettingsRowGroup title="App Preferences">
                <SettingsToggle label="Dark Mode" checked={darkMode} onChange={setDarkMode} />
                <>
                    <span style={{ fontWeight: 500 }}>Data Saver (Disable Autoplay)</span>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Off</span>
                </>
                <>
                    <span style={{ fontWeight: 500 }}>Language</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>English (UK)</span>
                        <span style={{ color: 'var(--text-tertiary)', fontSize: '1.2rem', cursor: 'pointer' }}>›</span>
                    </div>
                </>
            </SettingsRowGroup>

             {/* Account Management */}
             <SettingsRowGroup title="Account">
                <>
                    <span style={{ fontWeight: 500, color: 'var(--accent-secondary)' }}>Manage Subscription</span>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '1.2rem', cursor: 'pointer' }}>›</span>
                </>
                 <>
                    <span style={{ fontWeight: 500, color: 'var(--status-live)' }}>Log Out</span>
                </>
            </SettingsRowGroup>

             <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '2rem' }}>
                AgoroScores App Version 4.0.0 (Build 301)<br/>
                Powered by Advanced Sports Intelligence
            </div>
        </div>
    );
}
