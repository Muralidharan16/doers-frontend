import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { DoersLogo } from '@/components/ui/DoersLogo';

export default function VerifySuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden transition-colors duration-300" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <div className="absolute top-6 right-6"><ThemeToggle /></div>

      <div className="w-full max-w-[420px] px-2 sm:px-0 z-10 animate-fade-in">
        <div className="mb-8"><DoersLogo /></div>
        <div className="w-full transition-all duration-300" style={{ backgroundColor: 'var(--bg-surface)', border: '0.5px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '2.5rem' }}>
          <div className="flex flex-col items-center text-center space-y-6">
            <div style={{ width: '56px', height: '56px', backgroundColor: 'rgba(76,175,80,0.08)', border: '0.5px solid #4CAF50', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check style={{ color: '#4CAF50', width: '24px', height: '24px' }} strokeWidth={2} />
            </div>

            <div className="space-y-2">
              <h1 style={{ fontSize: '22px', fontWeight: 300, color: 'var(--text-primary)', margin: 0 }}>Email verified</h1>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 auto', lineHeight: 1.6, maxWidth: '320px' }}>
                Your email is verified. Return to the original signup tab to continue automatically. If that tab is no longer open, sign in on this device.
              </p>
            </div>

            <div className="w-full pt-4">
              <Button type="button" variant="primary" fullWidth onClick={() => navigate('/login', { replace: true })} style={{ backgroundColor: 'var(--accent)', color: '#FFFFFF', letterSpacing: '0.08em', fontSize: '12px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Check size={14} />
                <span>CONTINUE TO SIGN IN</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
