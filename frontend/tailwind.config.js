/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#22C55E',
        bg: '#0B0B0F',
        surface: '#111317',
        card: '#1B1E24',
        text: '#E4E4E7',
        textMuted: '#A1A1AA',
        border: '#27272A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
