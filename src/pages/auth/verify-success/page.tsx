import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { DoersLogo } from '@/components/ui/DoersLogo';

export default function VerifySuccessPage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="min-h-screen font-sans flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}
    >
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[420px] px-2 sm:px-0 z-10 animate-fade-in">
        <div className="mb-8">
          <DoersLogo />
        </div>

        <div 
          className="w-full transition-all duration-300"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '0.5px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
          }}
        >
          <div className="flex flex-col items-center text-center space-y-6">
            <div 
              style={{
                width: '56px',
                height: '56px',
                backgroundColor: 'rgba(76,175,80,0.08)',
                border: '0.5px solid #4CAF50',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Check style={{ color: '#4CAF50', width: '24px', height: '24px' }} strokeWidth={2} />
            </div>

            <div className="space-y-2">
              <h1 style={{ fontSize: '22px', fontWeight: 300, color: 'var(--text-primary)', margin: 0 }}>Email Verified!</h1>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 auto', lineHeight: 1.6, maxWidth: '320px' }}>
                Your email has been successfully verified. You can now continue with your setup and unlock all features of your account.
              </p>
            </div>

            <div className="w-full pt-4">
              <Button 
                type="button"
                variant="primary"
                fullWidth
                onClick={() => navigate('/dashboard')}
                style={{ 
                  backgroundColor: 'var(--accent)',
                  color: '#FFFFFF',
                  letterSpacing: '0.08em',
                  fontSize: '12px',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Check size={14} />
                <span>ACCOUNT READY</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer metadata */}
        <div 
          className="mt-8 text-center flex items-center justify-center gap-2"
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '8px', height: '8px' }}>
            <span style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#4CAF50', borderRadius: '50%', opacity: 0.4 }} className="animate-ping" />
            <span style={{ width: '4px', height: '4px', backgroundColor: '#4CAF50', borderRadius: '50%' }} />
          </div>
          <span>Last updated: {currentTime}</span>
        </div>
      </div>
    </div>
  );
}
