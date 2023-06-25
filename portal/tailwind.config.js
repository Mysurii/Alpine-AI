/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Volkhov', 'serif'],
      },
      colors: {
        gray: {
          50: '#F6FAFD',
        },
      },
    },
  },
  plugins: [],
}
