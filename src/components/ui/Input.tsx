import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  type = 'text',
  className = '',
  style,
  ...props
}, ref) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '11px',
    letterSpacing: '0.08em',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    fontWeight: 600,
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-input)',
    border: '0.5px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 14px',
    color: 'var(--text-primary)',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    ...style,
  };

  return (
    <div style={containerStyle} className="group">
      {label && <label style={labelStyle}>{label}</label>}
      <input
        ref={ref}
        type={type}
        style={inputStyle}
        className={`focus:border-[var(--border-focus)] placeholder:text-[var(--text-placeholder)] text-[16px] md:text-[14px] ${error ? 'border-[var(--red)] focus:border-[var(--red)]' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-[10px] text-[var(--red)] font-mono uppercase tracking-wider">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
