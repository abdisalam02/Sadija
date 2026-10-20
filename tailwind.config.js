/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['"Syne"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#fdfcf9',
          100: '#fcfbf8',
          200: '#f6f3eb',
          300: '#ede8dc',
          400: '#ded7c5',
          500: '#c5bba4',
        },
      },
    },
  },
  plugins: [],
}
