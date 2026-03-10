'use client';

import React from 'react';

interface TabSwitcherProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabSwitcher: React.FC<TabSwitcherProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      overflowX: 'auto',
      padding: '0.75rem 1.5rem',
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-main)',
      position: 'sticky',
      top: '64px', // Assuming AppHeader is ~64px
      zIndex: 40,
      scrollbarWidth: 'none', // Firefox
      msOverflowStyle: 'none',  // IE and Edge
    }}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            background: activeTab === tab ? 'var(--text-primary)' : 'var(--bg-elevated)',
            color: activeTab === tab ? 'var(--bg-main)' : 'var(--text-secondary)',
            fontWeight: activeTab === tab ? 700 : 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'background-color 0.2s, color 0.2s'
          }}
        >
          {tab}
        </button>
      ))}
      <style dangerouslySetInnerHTML={{__html: `
        /* Hide scrollbar for Chrome, Safari and Opera */
        div::-webkit-scrollbar {
            display: none;
        }
      `}} />
    </div>
  );
};
