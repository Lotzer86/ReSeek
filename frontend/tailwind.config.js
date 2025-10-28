/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#10B981',
        bg: '#000000',
        surface: '#0F1419',
        card: '#1A1F28',
        cardHover: '#232931',
        text: '#F9FAFB',
        textMuted: '#9CA3AF',
        border: '#374151',
        borderLight: '#4B5563',
        accent: {
          purple: '#A855F7',
          blue: '#3B82F6',
          red: '#EF4444',
          orange: '#F97316',
          green: '#10B981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
