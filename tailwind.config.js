/** @type {import('tailwindcss').Config} */
const { colors: defaultColors } = require('tailwindcss/defaultTheme');
const scrollbar = require('tailwind-scrollbar');

module.exports = {
  content: ['./client/**/*.{js,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: 'Lobster Two',
      },
      colors: {
        ...defaultColors,
        spill: {
          DEFAULT: '#141D26',
          50: '#F9FAFB',
          100: '#EDF0F3',
          200: '#DDE3E9',
          300: '#CBD4DC',
          400: '#B6C2CE',
          500: '#3E5265',
          600: '#334557',
          700: '#273645',
          800: '#1D2935',
          900: '#141D26',
          950: '#0C1116',
        },
      },
    },
  },
  plugins: [scrollbar],
};
