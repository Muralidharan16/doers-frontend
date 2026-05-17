import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  fullWidth?: boolean;
}

export function Button({ 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  children, 
  style,
  ...props 
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--accent)',
          color: '#FFFFFF',
          border: 'none',
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          border: '0.5px solid var(--border-strong)',
          color: 'var(--text-primary)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          border: 'none',
          color: 'var(--text-secondary)',
        };
      case 'danger':
        return {
          backgroundColor: 'transparent',
          border: '0.5px solid var(--red)',
          color: 'var(--red)',
        };
    }
  };

  const baseStyles: React.CSSProperties = {
    borderRadius: 'var(--radius-md)',
    padding: '10px 18px',
    fontSize: '13px',
    letterSpacing: '0.04em',
    fontWeight: 500,
    transition: 'opacity 0.15s, background-color 0.15s, transform 0.1s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
    width: fullWidth ? '100%' : 'auto',
    ...getVariantStyles(),
    ...style,
  };

  return (
    <button 
      style={baseStyles} 
      className={`hover:opacity-90 active:scale-[0.98] focus:outline-none transition-all duration-150 ${variant === 'ghost' ? 'hover:bg-[var(--bg-hover)]' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
