/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Dynamic colors tied to CSS variables */
        bg: {
          base: 'var(--bg-base)',
          surface: 'var(--bg-surface)',
          card: 'var(--bg-card)',
          'card-hover': 'var(--bg-card-hover)',
          input: 'var(--bg-input)',
        },
        border: {
          default: 'var(--border-default)',
          subtle: 'var(--border-subtle)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          disabled: 'var(--text-disabled)',
        },
        sidebar: {
          bg: 'var(--sidebar-bg)',
        },
        /* Brand tokens (constant across both themes) */
        gold: {
          DEFAULT: '#c9a96e',
          light: '#e8d5a3',
          dark: '#9a7845',
        },
        ruby: '#c94a4a',
        sage: '#5a8a6a',
        sapphire: '#4a6fa5',
        amber: '#c97a2a',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.65s cubic-bezier(0.15, 0.9, 0.25, 1)',
        'breathe': 'breathe 6s ease-in-out infinite alternate',
        'sync-pulse': 'syncPulse 1.6s ease-in-out infinite',
        'sync-pulse-delay-1': 'syncPulse 1.6s ease-in-out infinite 0.2s',
        'sync-pulse-delay-2': 'syncPulse 1.6s ease-in-out infinite 0.4s',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        breathe: {
          '0%': { opacity: '0.3', transform: 'scale(0.98)' },
          '100%': { opacity: '0.7', transform: 'scale(1.02)' },
        },
        syncPulse: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
      },

    },
  },
  plugins: [],
};