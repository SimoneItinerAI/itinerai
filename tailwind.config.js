/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A2B4C',
          dark: '#0F1A2E',
          light: '#2C3E5A',
        },
        secondary: {
          DEFAULT: '#2F80ED',
          light: '#4A90E2',
          dark: '#1C6DD8',
        },
        accent: {
          DEFAULT: '#FF8A3D',
          light: '#FFA366',
          dark: '#E67628',
          gradient: 'linear-gradient(135deg, #FF8A3D 0%, #E67628 100%)',
        },
        neutral: {
          50: '#F5F7FB',
          100: '#E8EDF5',
          200: '#D1D9E8',
          300: '#B4C0D4',
          400: '#8B9AB8',
          500: '#6B7C9A',
          600: '#5B6473',
          700: '#4A5466',
          800: '#3C4555',
          900: '#2E3441',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      borderRadius: {
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
        card: '0 8px 32px -8px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};