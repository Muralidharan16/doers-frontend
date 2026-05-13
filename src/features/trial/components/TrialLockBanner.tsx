import { useNavigate } from 'react-router-dom';
import { CreditCard, X } from 'lucide-react';
import { useTrialLockStore } from '../store/trialLockStore';

export function TrialLockBanner() {
  const navigate = useNavigate();
  const { code, message, clearLock } = useTrialLockStore();

  if (code !== 'SOFT_LOCKED') return null;

  return (
    <div style={{
      position: 'fixed',
      left: 16,
      right: 16,
      bottom: 16,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: '14px 16px',
      borderRadius: 14,
      background: '#1a1a1a',
      color: '#ffffff',
      boxShadow: '0 18px 44px rgba(0,0,0,0.24)',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <CreditCard size={16} />
        <span style={{ fontSize: 13, lineHeight: 1.4 }}>
          {message || 'Your trial has expired. Account is in read-only mode.'}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          type="button"
          onClick={() => navigate('/subscriptions')}
          style={{
            border: '1px solid rgba(255,255,255,0.22)',
            background: '#ffffff',
            color: '#111111',
            borderRadius: 999,
            padding: '9px 13px',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Subscribe Now
        </button>
        <button
          type="button"
          onClick={clearLock}
          aria-label="Dismiss trial notice"
          style={{
            width: 30,
            height: 30,
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'transparent',
            color: '#ffffff',
            borderRadius: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
