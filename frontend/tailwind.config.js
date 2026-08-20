/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0a7e7e',
          dark: '#065e5e',
          light: '#0d9a9a',
        },
        navy: {
          DEFAULT: '#0a2e3c',
          dark: '#061e28',
          light: '#1a4a5c',
        },
        gold: {
          DEFAULT: '#e8b930',
          dark: '#c9a028',
          light: '#f5d060',
        },
        coral: {
          DEFAULT: '#e74c3c',
          dark: '#c0392b',
        },
        gray: {
          50: '#f8f9fa',
          100: '#f0f2f4',
          200: '#e2e6ea',
          300: '#cdd3d8',
          400: '#a0aab4',
          500: '#6c7a86',
          600: '#4a5568',
          700: '#2d3748',
          800: '#1a202c',
          900: '#0d1117',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'translate(-50%, -6px) scale(0.85)' },
          '100%': { opacity: '1', transform: 'translate(-50%, 0) scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'pop-in': 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
    },
  },
  plugins: [],
}
