/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          '"Helvetica Neue"',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
      },
      colors: {
        ios: {
          blue: '#007AFF',
          'blue-dark': '#0A84FF',
          red: '#FF3B30',
          'red-dark': '#FF453A',
          green: '#34C759',
          orange: '#FF9500',
          gray: '#8E8E93',
          'fill-1': '#F2F2F7',
          'fill-2': '#E5E5EA',
          'fill-3': '#D1D1D6',
          'dark-bg': '#000000',
          'dark-surface': '#1C1C1E',
          'dark-surface-2': '#2C2C2E',
          'dark-border': '#38383A',
        },
      },
      borderRadius: {
        ios: '0.875rem',
        'ios-lg': '1.25rem',
      },
      boxShadow: {
        ios: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};
