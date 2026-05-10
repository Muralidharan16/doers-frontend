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
        rise: 'rise 0.5s ease both',
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};