import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'healthy' | 'stable' | 'warning' | 'initializing' | 'gold' | 'muted';
}

export function Badge({ variant = 'muted', children, style, className = '', ...props }: BadgeProps) {
  const getColor = () => {
    switch (variant) {
      case 'healthy':
      case 'stable':
        return 'var(--green)';
      case 'warning':
        return 'var(--red)';
      case 'gold':
        return 'var(--accent)';
      case 'initializing':
      case 'muted':
      default:
        return 'var(--text-muted)';
    }
  };

  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '0.5px solid currentColor',
    backgroundColor: 'transparent',
    color: getColor(),
    fontSize: '10px',
    letterSpacing: '0.1em',
    padding: '3px 10px',
    borderRadius: '3px',
    textTransform: 'uppercase',
    fontWeight: 600,
    lineHeight: 1,
    ...style,
  };

  return (
    <div style={badgeStyle} className={className} {...props}>
      {children}
    </div>
  );
}
