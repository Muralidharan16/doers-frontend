/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0f0f0d',
          60: 'rgba(15,15,13,0.6)',
          30: 'rgba(15,15,13,0.3)',
          10: 'rgba(15,15,13,0.08)',
        },
        paper: {
          DEFAULT: '#f5f3ee',
          alt: '#ede9e1',
        },
        gold: {
          DEFAULT: '#b8935a',
          light: '#f0e8d8',
        },
        rule: 'rgba(15,15,13,0.12)',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        mono: ['Geist Mono', 'monospace'],
        sans: ['Instrument Sans', 'sans-serif'],
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