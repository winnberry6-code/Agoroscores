'use client';

import React from 'react';
import Link from 'next/link';

export const AppHeader = () => {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(26, 29, 36, 0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      {/* Brand */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#000', fontWeight: 'bold', fontSize: '14px' }}>A</span>
        </div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', margin: 0 }}>
          Agoro<span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Scores</span>
        </h1>
      </Link>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.2rem' }}>
          🔍
        </button>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.2rem', position: 'relative' }}>
          🔔
          <span style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', background: 'var(--accent-primary)', borderRadius: '50%' }}></span>
        </button>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-highlight)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid var(--border-subtle)' }}>
            👤
        </div>
      </div>
    </header>
  );
};
