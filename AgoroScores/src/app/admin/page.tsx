'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [activeMenu, setActiveMenu] = useState('DASHBOARD');

  return (
    <div className="admin-shell" style={{ display: 'flex', height: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      {/* Sidebar Navigation */}
      <aside style={{ width: '250px', background: 'var(--bg-elevated)', borderRight: '1px solid var(--border-subtle)', padding: '2rem 1rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--accent-primary)' }}>AgoroScores<br/><span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Command Center</span></h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {['DASHBOARD', 'LIVE_ENGINE', 'BETTING_CMS', 'VAR_OVERRIDES'].map(item => (
            <button 
              key={item}
              className="btn"
              style={{ textAlign: 'left', background: activeMenu === item ? 'var(--accent-secondary)' : 'transparent', color: activeMenu === item ? '#fff' : 'inherit', border: 'none' }}
              onClick={() => setActiveMenu(item)}
            >
              {item.replace('_', ' ')}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
        {activeMenu === 'DASHBOARD' && <SystemHealthDashboard />}
        {activeMenu === 'VAR_OVERRIDES' && <VARSimulator />}
        {activeMenu === 'BETTING_CMS' && <BettingCMS />}
        {/* Placeholder for LIVE_ENGINE */}
      </main>
    </div>
  );
}

// Sub-components
const SystemHealthDashboard = () => (
  <div>
    <h1 style={{ marginBottom: '2rem' }}>System Health Dashboard</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
      <div className="card" style={{ borderLeft: '4px solid var(--accent-success)' }}>
        <span className="subtitle">SportsMonks API</span>
        <h2>Healthy (124ms)</h2>
      </div>
      <div className="card" style={{ borderLeft: '4px solid var(--accent-success)' }}>
        <span className="subtitle">LiveSyncWorker</span>
        <h2>Polling Active</h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Last seen: 2s ago</span>
      </div>
      <div className="card" style={{ borderLeft: '4px solid var(--accent-warning)' }}>
        <span className="subtitle">Dead Letter Queue (DLQ)</span>
        <h2>12 Messages</h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Requires manual review</span>
      </div>
    </div>
  </div>
);

const BettingCMS = () => (
  <div>
    <h1 style={{ marginBottom: '2rem' }}>Betting Content Manager</h1>
    <div className="card">
        <h3>Publish New Tip</h3>
        <input type="text" placeholder="Fixture ID" className="input-field" style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }} />
        <input type="text" placeholder="Market (e.g., 1X2, BTTS)" className="input-field" style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }} />
        <textarea placeholder="Admin Reasoning (Will be sent to Gemini for polishing)" className="input-field" style={{ width: '100%', height: '100px', padding: '0.5rem', margin: '0.5rem 0' }}></textarea>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
            <label><input type="checkbox" /> Premium Only</label>
        </div>
        <button className="btn btn-primary">Process via Gemini & Publish</button>
    </div>
  </div>
);

const VARSimulator = () => (
    <div>
        <h1 style={{ marginBottom: '2rem' }}>VAR Override Simulator</h1>
        <p className="subtitle" style={{ marginBottom: '2rem' }}>
            Use this to manually trigger WebSockets patches simulating SportsMonks VAR reversals.
        </p>

        <div className="card" style={{ border: '1px solid var(--accent-danger)' }}>
            <h3>Manual Event Action</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <input type="text" placeholder="Target Fixture ID" className="input-field" style={{ padding: '0.5rem' }} />
                <input type="text" placeholder="Target Event ID" className="input-field" style={{ padding: '0.5rem' }} />
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <button className="btn" style={{ background: 'var(--accent-warning)', color: '#000' }}>Trigger Disallowed Goal</button>
                <button className="btn" style={{ background: 'var(--accent-danger)', color: '#fff' }}>Trigger Red Card Reversal</button>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                * Bypasses `LiveSyncWorker` and directly pushes `is_var_reversed: true` to Redis Pub/Sub.
            </p>
        </div>
    </div>
);
