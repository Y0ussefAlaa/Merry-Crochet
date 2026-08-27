/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F3F7F4',
          100: '#E2ECE5',
          200: '#C7D9CC',
          300: '#A7C2AF',
          400: '#8FAF9A', // Primary Light Sage
          500: '#73957F',
          600: '#5A7865',
          700: '#465F50',
          800: '#384B40',
          900: '#28362E',
        },
        rose: {
          50: '#FAF2F1',
          100: '#F4E3E1',
          200: '#E7C8C4',
          300: '#D9ABA4',
          400: '#C99A91', // Dusty Rose
          500: '#B67E75',
          600: '#9E625A',
          700: '#814B44',
          800: '#643833',
        },
        cream: {
          50: '#FFFDF9',
          100: '#F8F3EA', // Soft Cream
          200: '#F2E8D7',
          300: '#E8DCCB', // Warm Beige
          400: '#D9C8B1',
          500: '#C2AF94',
        },
        warmbrown: {
          400: '#946D5E',
          500: '#795548', // Warm Brown
          600: '#614237',
          700: '#4B3128',
          800: '#332C2A', // Dark Text
        },
        darkbg: {
          DEFAULT: '#171614',
          surface: '#24211E',
          card: '#2C2824',
          border: '#3B3631',
          cream: '#F5EFE6',
          muted: '#B8AEA3',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'cozy': '0 8px 30px rgba(121, 85, 72, 0.06)',
        'cozy-lg': '0 14px 40px rgba(121, 85, 72, 0.12)',
        'dark-cozy': '0 10px 30px rgba(0, 0, 0, 0.4)',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
};
