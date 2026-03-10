'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', path: '/', icon: '🏠' },
    { label: 'Matches', path: '/matches', icon: '⚽' },
    { label: 'News', path: '/news', icon: '📰' },
    { label: 'Favorites', path: '/favorites', icon: '⭐' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '70px',
      backgroundColor: 'var(--bg-elevated)',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 50,
      paddingBottom: 'env(safe-area-inset-bottom)' // iOS Safe Area support
    }}>
      {navItems.map(item => {
        const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
        
        return (
          <Link 
            key={item.label} 
            href={item.path} 
            style={{ 
              textDecoration: 'none', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '4px',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)',
              flex: 1
            }}
          >
            <span style={{ fontSize: '1.5rem', filter: isActive ? 'none' : 'grayscale(100%) opacity(0.7)' }}>
              {item.icon}
            </span>
            <span style={{ fontSize: '0.65rem', fontWeight: isActive ? 600 : 500 }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
