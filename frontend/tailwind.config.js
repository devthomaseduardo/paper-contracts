/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: '#020305',
          lighter: '#080a0e',
          deep: '#010102',
        },
        azure: {
          DEFAULT: '#1e40af', 
          light: '#3b82f6',
          dark: '#1d4ed8',
        },
        gold: {
          DEFAULT: '#c5a059',
          light: '#d4b47a',
          dark: '#a68242',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        serif: ['Lora', 'Times New Roman', 'serif'],
      },
      animation: {
        'in-scale': 'inScale .4s cubic-bezier(0.16, 1, 0.3, 1)',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'scan': 'scan 3s linear infinite',
      },
      keyframes: {
        inScale: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scan: {
          '0%': { transform: 'translateY(0)', opacity: 0 },
          '50%': { opacity: 1 },
          '100%': { transform: 'translateY(400px)', opacity: 0 },
        }
      },
    },
  },
  plugins: [],
}
