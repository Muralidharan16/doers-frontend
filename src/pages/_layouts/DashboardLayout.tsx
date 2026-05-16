import { Outlet, NavLink } from 'react-router-dom';
import { useTheme } from '@/shared/context/ThemeContext';
import {
  Sun, Moon,
  LayoutDashboard, Users, CreditCard, DollarSign,
  BarChart3, CalendarCheck, Building2, Settings,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '@/features/auth';
import { useNavigate } from 'react-router-dom';

const SIDEBAR_WIDTH = 220;

const navItems = [
  { to: '/dashboard',     label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/members',       label: 'Members',         icon: Users },
  { to: '/subscriptions', label: 'Subscriptions',   icon: CreditCard },
  { to: '/billing',       label: 'Payments',         icon: DollarSign },
  { to: '/reports',       label: 'Reports',          icon: BarChart3 },
  { to: '/attendance',    label: 'Attendance',       icon: CalendarCheck },
  { to: '/gyms',          label: 'Gyms',             icon: Building2 },
  { to: '/settings',      label: 'Settings',         icon: Settings },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleLogout = () => {
    clearAuth();
    navigate('/login', { replace: true });
  };

  const colors = {
    bg:          isDark ? '#0e0e0e' : '#f5f3ef',
    card:        isDark ? '#1c1c1c' : '#ffffff',
    cardBorder:  isDark ? '#2e2e2e' : '#e8e4de',
    text:        isDark ? '#f0f0f0' : '#1a1a1a',
    textMuted:   isDark ? '#888888' : '#525252',
    textBody:    isDark ? '#aaaaaa' : '#5a5a5a',
    divider:     isDark ? '#272727' : '#ede9e4',
    gold:        '#b8935a',
    goldBg:      'rgba(184,147,90,0.08)',
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          margin: 2px 0;
          font-size: 13px;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          color: ${colors.textBody};
          text-decoration: none;
          border-left: 2px solid transparent;
          transition: all 0.2s ease;
        }
        .nav-item:hover {
          background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
          color: ${colors.text};
        }
        .nav-item.active {
          border-left-color: ${colors.gold};
          color: ${colors.gold};
          background: ${colors.goldBg};
        }

        .sidebar-toggle {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid ${colors.cardBorder};
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: ${colors.textMuted};
          transition: all 0.2s;
        }
        .sidebar-toggle:hover {
          color: ${colors.text};
          border-color: ${isDark ? '#3a3a3a' : '#ccc8c2'};
        }
      `}</style>

      {/* ── Sidebar ── */}
      <aside style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: SIDEBAR_WIDTH,
        backgroundColor: colors.card,
        borderRight: `1px solid ${colors.cardBorder}`,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 40,
      }}>

        {/* ── Logo section ── */}
        <div style={{
          padding: '32px 24px 28px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 12,
          }}>
            <img
              src={isDark ? '/doers_icon_light.png' : '/doers_icon_dark.png'}
              alt="Doers Icon"
              style={{
                height: 34,
                width: 34,
                objectFit: 'contain',
              }}
            />
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 26,
              fontWeight: 500,
              color: colors.text,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}>
              Doers
            </div>
          </div>
          <div style={{
            fontSize: 9,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: colors.textMuted,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            lineHeight: 1.6,
            opacity: 0.8,
          }}>
            The Operating System for<br />
            Fitness & Wellness
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav style={{
          flex: 1,
          padding: '12px 0',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* ── Bottom section ── */}
        <div style={{
          padding: '20px 16px 24px',
          borderTop: `1px solid ${colors.divider}`,
        }}>
          {/* Theme toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}>
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              color: colors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              Appearance
            </span>
            <button
              onClick={toggleTheme}
              className="sidebar-toggle"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>

          {/* User info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: colors.gold,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 600,
              flexShrink: 0,
            }}>
              AD
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 13,
                fontWeight: 500,
                color: colors.textBody,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                Admin User
              </div>
              <div style={{
                fontSize: 11,
                color: colors.textMuted,
              }}>
                Owner
              </div>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="sidebar-toggle"
            style={{
              width: '100%',
              marginTop: 16,
              borderRadius: 8,
              fontSize: 12,
              gap: 8,
              justifyContent: 'center',
            }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{
        marginLeft: SIDEBAR_WIDTH,
        flex: 1,
        backgroundColor: colors.bg,
        overflowY: 'auto',
        minHeight: '100vh',
      }}>
        <Outlet />
      </main>
    </div>
  );
}
