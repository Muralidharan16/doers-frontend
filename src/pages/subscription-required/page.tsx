import { Link } from 'react-router-dom';
import { CreditCard, LockKeyhole } from 'lucide-react';
import { useTrialLockStore } from '@/features/trial';

export default function SubscriptionRequiredPage() {
  const message = useTrialLockStore((state) => state.message);

  return (
    <main style={{
      minHeight: '100vh',
      background: '#f5f3ef',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    }}>
      <section style={{
        width: '100%',
        maxWidth: 520,
        background: '#ffffff',
        border: '1px solid #e8e4de',
        borderRadius: 24,
        boxShadow: '0 32px 64px -16px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.03)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '44px 40px 32px',
          textAlign: 'center',
          borderBottom: '1px solid #ede9e4',
        }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: '#1a1a1a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <LockKeyhole size={20} />
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 26,
            fontWeight: 500,
            color: '#1a1a1a',
            margin: '0 0 10px',
          }}>
            Subscription required
          </h1>
          <p style={{
            color: '#5a5a5a',
            fontSize: 14,
            lineHeight: 1.7,
            margin: 0,
          }}>
            {message || 'Your account is hard-locked. Please subscribe to continue.'}
          </p>
        </div>
        <div style={{ padding: '28px 40px 36px' }}>
          <Link
            to="/subscriptions"
            style={{
              width: '100%',
              background: '#1a1a1a',
              color: '#ffffff',
              borderRadius: 50,
              padding: '15px 24px',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxSizing: 'border-box',
            }}
          >
            <CreditCard size={15} />
            Subscribe Now
          </Link>
        </div>
      </section>
    </main>
  );
}
