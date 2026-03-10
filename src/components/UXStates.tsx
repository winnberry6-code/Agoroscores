import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  actionText, 
  onAction,
  icon = '⚽'
}) => {
  return (
    <div className="empty-state" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '4rem 2rem',
      textAlign: 'center',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--bg-elevated)',
      border: '1px dashed var(--border-subtle)'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>
        {icon}
      </div>
      <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
        {description}
      </p>
      
      {actionText && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export const MatchRowSkeleton = () => (
    <div className="card match-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', height: '80px' }}>
        <div className="skeleton" style={{ width: '40px', height: '20px', borderRadius: '4px' }}></div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '1rem' }}>
            <div className="skeleton" style={{ width: '60%', height: '16px', borderRadius: '4px' }}></div>
            <div className="skeleton" style={{ width: '40%', height: '16px', borderRadius: '4px' }}></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
             <div className="skeleton" style={{ width: '20px', height: '16px', borderRadius: '4px' }}></div>
             <div className="skeleton" style={{ width: '20px', height: '16px', borderRadius: '4px' }}></div>
        </div>
    </div>
);
