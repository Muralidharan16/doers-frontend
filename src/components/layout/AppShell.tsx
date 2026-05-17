import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useAuthStore } from '@/features/auth';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  const formatName = (name: string) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  // Prevent scroll when mobile drawer is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-page)' }} className="transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div 
        className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-[248px]"
      >
        {/* Navbar */}
        <header 
          className="fixed top-0 right-0 left-0 lg:left-[248px] z-40 flex items-center justify-between px-6 transition-all duration-300"
          style={{ 
            height: 'var(--navbar-height)', 
            backgroundColor: 'var(--bg-surface)', 
            borderBottom: '0.5px solid var(--border-default)' 
          }}
        >
          {/* Left Side: Mobile Toggler & Branding */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1 text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-md transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="lg:hidden flex items-center gap-2">
              <div 
                style={{ 
                  width: '28px', 
                  height: '28px', 
                  backgroundColor: 'var(--accent)', 
                  borderRadius: '4px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  border: 'none' 
                }}
              >
                <img 
                  src="/doers_icon_light.png" 
                  alt="Doers" 
                  className="w-4 h-4 object-contain" 
                  style={{ filter: 'brightness(0) invert(1)', border: 'none' }} 
                />
              </div>
              <span className="font-serif text-[15px] font-medium text-[var(--text-primary)]">Doers</span>
            </div>
          </div>

          {/* Right Side: Theme Toggle & Mini Profile */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center font-sans text-white text-[11px] font-medium"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
              </div>
              <span className="hidden sm:inline text-[13px] font-medium text-[var(--text-primary)]">
                {user?.name ? formatName(user.name) : 'Studio Owner'}
              </span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 pt-[calc(var(--navbar-height)+1.5rem)] md:pt-[calc(var(--navbar-height)+2rem)] transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
