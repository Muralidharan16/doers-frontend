import { useNavigate } from 'react-router-dom';
import { CreditCard, X, ArrowRight } from 'lucide-react';
import { useTrialLockStore } from '../store/trialLockStore';

export function TrialLockBanner() {
  const navigate = useNavigate();
  const { code, message, clearLock } = useTrialLockStore();

  if (code !== 'SOFT_LOCKED') return null;

  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-12 z-[100] w-[92%] max-w-2xl">
      <div className="editorial-card bg-ink text-paper p-8 flex flex-col md:flex-row items-center justify-between gap-8 animate-subtle-up shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-sm bg-paper flex items-center justify-center border border-paper/10">
            <CreditCard size={20} strokeWidth={1} />
          </div>
          <div className="space-y-1">
            <div className="metadata-label text-gold !opacity-100">Membership Protocol</div>
            <p className="font-serif italic text-lg leading-tight opacity-90">
              {message || 'The trial cycle has reached its conclusion.'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => navigate('/subscriptions')}
            className="btn-luxury-primary bg-paper text-ink hover:bg-paper/90 flex items-center gap-2 whitespace-nowrap"
          >
            <span>Evaluate Plans</span>
            <ArrowRight size={14} />
          </button>
          <button
            type="button"
            onClick={clearLock}
            className="p-1 opacity-20 hover:opacity-100 transition-opacity"
            aria-label="Dismiss Notification"
          >
            <X size={18} strokeWidth={1} />
          </button>
        </div>
      </div>
    </div>
  );
}
