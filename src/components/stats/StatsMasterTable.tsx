'use client';

import React from 'react';

interface Column {
    key: string;
    label: string;
    align?: 'left' | 'center' | 'right';
    width?: string;
}

interface StatsMasterTableProps {
    columns: Column[];
    data: any[];
    isLoading?: boolean;
}

export const StatsMasterTable: React.FC<StatsMasterTableProps> = ({ columns, data, isLoading }) => {
    if (isLoading) {
        return (
            <div style={{ padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="skeleton" style={{ height: '40px', marginBottom: '0.5rem', borderRadius: '4px' }} />
                ))}
            </div>
        );
    }

    return (
        <div style={{ 
            width: '100%', 
            overflowX: 'auto', 
            background: 'var(--bg-elevated)', 
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            scrollbarWidth: 'none' // Firefox
        }}>
            <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-main)' }}>
                        {columns.map((col, index) => (
                            <th 
                                key={col.key} 
                                style={{ 
                                    padding: '0.75rem 1rem', 
                                    textAlign: col.align || 'center',
                                    color: 'var(--text-secondary)',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.5px',
                                    whiteSpace: 'nowrap',
                                    width: col.width,
                                    // Make the first column (usually Team) sticky
                                    position: index === 0 ? 'sticky' : 'static',
                                    left: index === 0 ? 0 : 'auto',
                                    background: index === 0 ? 'var(--bg-main)' : 'transparent',
                                    zIndex: index === 0 ? 10 : 1,
                                    borderRight: index === 0 ? '1px solid var(--border-subtle)' : 'none'
                                }}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover-scale" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            {columns.map((col, colIndex) => (
                                <td 
                                    key={col.key} 
                                    style={{ 
                                        padding: '0.75rem 1rem', 
                                        textAlign: col.align || 'center',
                                        // Sticky first column logic
                                        position: colIndex === 0 ? 'sticky' : 'static',
                                        left: colIndex === 0 ? 0 : 'auto',
                                        background: colIndex === 0 ? 'var(--bg-elevated)' : 'transparent',
                                        zIndex: colIndex === 0 ? 10 : 1,
                                        borderRight: colIndex === 0 ? '1px solid var(--border-subtle)' : 'none',
                                        fontWeight: colIndex === 0 ? 700 : 500,
                                        color: colIndex === 0 ? 'var(--text-primary)' : 'var(--text-secondary)'
                                    }}
                                >
                                    {row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
             <style dangerouslySetInnerHTML={{__html: `div::-webkit-scrollbar { display: none; }`}} />
        </div>
    );
};
