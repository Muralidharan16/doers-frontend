import React from 'react';

interface PageHeaderProps {
  title: string;
  category?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, category, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-8 animate-fade-in">
      <div className="space-y-1">
        {category && (
          <div 
            style={{ 
              fontSize: '10px', 
              letterSpacing: '0.12em', 
              color: 'var(--text-muted)', 
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            {category}
          </div>
        )}
        <h1 
          style={{ 
            fontSize: '22px', 
            fontWeight: 300, 
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h1>
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}
