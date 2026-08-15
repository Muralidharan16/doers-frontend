import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ children, style, className = '', ...props }: CardProps) {
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-surface)',
    border: '0.5px solid var(--border-default)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
    ...style,
  };

  return (
    <div style={cardStyle} className={className} {...props}>
      {children}
    </div>
  );
}
