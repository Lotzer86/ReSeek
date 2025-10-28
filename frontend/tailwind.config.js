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
        bg: '#0F172A',
        surface: '#1E293B',
        card: '#334155',
        cardHover: '#475569',
        text: '#F1F5F9',
        textMuted: '#94A3B8',
        border: '#475569',
        borderLight: '#64748B',
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
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
