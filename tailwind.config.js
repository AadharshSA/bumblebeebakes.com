/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        strawberry: '#F7C8D5',
        vanilla: '#FFF8EC',
        butter: '#F9E6A7',
        lavender: '#DCD4F4',
        pistachio: '#DDE8CC',
        cocoa: '#674638',
        ink: '#3E2C27',
        rose: { DEFAULT: '#C8768A', deep: '#B05C72' },
        sand: '#EDE4D6',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        fadeUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideInR: { from: { opacity: 0, transform: 'translateX(8%)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        slideInL: { from: { opacity: 0, transform: 'translateX(-8%)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        pop: { '0%': { transform: 'scale(.7)', opacity: 0 }, '70%': { transform: 'scale(1.05)' }, '100%': { transform: 'scale(1)', opacity: 1 } },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        spinSlow: 'spinSlow 22s linear infinite',
        float: 'float 5s ease-in-out infinite',
        fadeUp: 'fadeUp .7s cubic-bezier(.2,.7,.2,1) both',
        fadeIn: 'fadeIn .4s ease-out both',
        slideInR: 'slideInR .45s cubic-bezier(.2,.7,.2,1) both',
        slideInL: 'slideInL .45s cubic-bezier(.2,.7,.2,1) both',
        pop: 'pop .45s ease-out both',
      },
    },
  },
  plugins: [],
};
