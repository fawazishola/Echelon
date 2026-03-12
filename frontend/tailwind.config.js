/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#F0F4FF',
          600: '#4C6EF5',
          700: '#4263EB',
        },
        amber: {
          400: '#FFD43B',
          500: '#FCC419',
        },
        emerald: {
          500: '#10B981',
        },
        rose: {
          500: '#F43F5E',
        },
        slate: {
          100: '#F1F5F9',
          400: '#94A3B8',
          600: '#475569',
          900: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      animation: {
        'shimmer': 'shimmer 1.5s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
