/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Driven by CSS variables so the type lab can re-skin the whole page
        // live. The fallbacks are what production ships with.
        syne: ['var(--font-display, "Syne", sans-serif)'],
        sans: ['var(--font-body, "Plus Jakarta Sans", system-ui, sans-serif)'],
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
