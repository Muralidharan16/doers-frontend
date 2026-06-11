import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth';
import { useBranchStore } from '@/features/gym';
import { X, LayoutDashboard, Users, CreditCard, DollarSign, BarChart3, CalendarCheck, Building2, Settings, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { assetService } from '@/lib/services/assetService';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/members', label: 'Members', icon: Users },
  { to: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { to: '/billing', label: 'Payments', icon: DollarSign },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
  { to: '/gyms', label: 'Gyms', icon: Building2 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const user = useAuthStore((s) => s.user);
  const { selectedBranch, clearBranches } = useBranchStore();
  const [logoThumbUrl, setLogoThumbUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchLogo() {
      try {
        const data = await assetService.getLogoStatus();
        if (isMounted && data.logo_thumb_url) {
          setLogoThumbUrl(data.logo_thumb_url);
        }
      } catch {
        // Ignore
      }
    }
    fetchLogo();

    const handleLogoUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<string | null>;
      if (isMounted) {
        setLogoThumbUrl(customEvent.detail);
      }
    };

    window.addEventListener('logo-updated', handleLogoUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('logo-updated', handleLogoUpdate);
    };
  }, []);

  const handleLogout = () => {
    clearAuth();
    clearBranches();
    localStorage.removeItem('auth-storage');
    localStorage.removeItem('branch-storage');
    sessionStorage.removeItem('signup-email');
    queryClient.clear();
    navigate('/login', { replace: true });
    setIsOpen(false);
  };

  const formatName = (name: string) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full w-full bg-[var(--bg-sidebar)] border-r border-[var(--border-default)] select-none">
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-[var(--border-default)]">
        <div className="flex items-center gap-3">
          <div 
            style={{ 
              width: '36px', 
              height: '36px', 
              backgroundColor: 'var(--accent)', 
              borderRadius: '6px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              border: 'none' 
            }}
          >
            <img 
              src="/doers_icon_light.png" 
              alt="Doers" 
              className="w-[18px] h-[18px] object-contain" 
              style={{ filter: 'brightness(0) invert(1)', border: 'none' }} 
            />
          </div>
          <div className="space-y-0">
            <div className="font-serif text-md tracking-tight leading-none text-[var(--text-primary)] font-medium">Doers</div>
            <div className="text-[9px] font-bold uppercase text-[var(--text-muted)]" style={{ letterSpacing: '0.15em' }}>Studio OS</div>
          </div>
        </div>
        {/* Close Button on Mobile Drawer */}
        <button 
          onClick={() => setIsOpen(false)} 
          className="lg:hidden p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-md transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-[var(--radius-md)] transition-all duration-150 group ${
                  isActive 
                    ? 'bg-[var(--bg-hover)] text-[var(--text-primary)] font-semibold border-l-[2px] border-[var(--accent)]' 
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                }`
              }
              end={item.to === '/dashboard'}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon 
                      size={18} 
                      strokeWidth={isActive ? 2 : 1.5} 
                      className="transition-all duration-150" 
                      style={{ color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }}
                    />
                    <span className="text-[13px] tracking-[0.03em]">{item.label}</span>
                  </div>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Profile/Footer */}
      <div className="p-4 border-t border-[var(--border-default)]">
        <div className="flex items-center gap-3.5 mb-4 px-2">
          {logoThumbUrl ? (
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[var(--border-strong)] bg-white flex items-center justify-center flex-shrink-0">
              <img 
                src={logoThumbUrl} 
                alt="Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
          ) : (
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center font-sans text-white text-[12px] font-medium flex-shrink-0"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-medium truncate leading-tight text-[var(--text-primary)]">
              {user?.name ? formatName(user.name) : 'Studio Owner'}
            </div>
            <div className="text-[11px] font-normal truncate text-[var(--text-muted)]">
              {selectedBranch?.name || user?.organizationName || 'Studio Enterprise'}
            </div>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          fullWidth 
          onClick={handleLogout}
          className="text-left justify-start gap-3 px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--red)]"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (always visible, fixed left) */}
      <aside 
        className="hidden lg:flex fixed left-0 top-0 bottom-0 z-30" 
        style={{ width: 'var(--sidebar-width)' }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (visible only when open) */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}>
        {/* Backdrop overlay */}
        <div 
          onClick={() => setIsOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        />
        
        {/* Sliding Panel */}
        <div 
          className={`absolute left-0 top-0 bottom-0 transition-transform duration-200 ease-out`}
          style={{ 
            width: 'var(--sidebar-width)',
            transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
          }}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
