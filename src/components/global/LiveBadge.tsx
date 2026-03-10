import React from 'react';

interface MatchStatusBadgeProps {
  status: string;    // NS, LIVE, HT, FT, PEN_LIVE, POST, CANC
  minute?: number;
  isStale?: boolean; // Determines if we fallback to Amber delay
}

export const MatchStatusBadge: React.FC<MatchStatusBadgeProps> = ({ status, minute, isStale = false }) => {
  const isLive = ['LIVE', 'PEN_LIVE', 'HT'].includes(status);
  
  if (isLive) {
    if (isStale) {
      return (
        <div className="pill-delayed flex-center" style={{ gap: '0.25rem' }}>
          <span>🟠</span> {status === 'HT' ? 'HT' : `${minute}'`}
        </div>
      );
    }
    return (
      <div style={{ color: 'var(--status-live)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem' }}>
        <span className="pulse-live"></span>
        {status === 'HT' ? 'HT' : `${minute}'`}
      </div>
    );
  }

  // Pre-match or Post-match
  let displayStatus = 'FT';
  let color = 'var(--text-tertiary)';

  if (status === 'NS') {
      displayStatus = 'Upcoming';
  } else if (status === 'POST' || status === 'CANC') {
      displayStatus = status;
      color = 'var(--status-delayed)';
  }

  return (
    <div style={{ color, fontWeight: 600, fontSize: '0.875rem' }}>
      {displayStatus}
    </div>
  );
};
