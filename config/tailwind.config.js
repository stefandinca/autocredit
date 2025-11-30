/**
 * Tailwind CSS Configuration
 * For production build optimization
 *
 * To use this config for production:
 * 1. Install Tailwind: npm install -D tailwindcss
 * 2. Create input.css with @tailwind directives
 * 3. Build: npx tailwindcss -i ./input.css -o ./css/output.css --minify
 */

module.exports = {
  content: [
    "./*.html",
    "./js/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#d9e2ff',
          200: '#b4c7ff',
          300: '#8ea8ff',
          400: '#6788ff',
          500: '#4169ff',
          600: '#0A1128',
          700: '#080d1f',
          800: '#060916',
          900: '#03040b',
        },
        accent: {
          50: '#fff4ed',
          100: '#ffe6d5',
          200: '#fec9aa',
          300: '#fea574',
          400: '#fe7a3c',
          500: '#FF6B35',
          600: '#f24d16',
          700: '#c73b0c',
          800: '#9e3112',
          900: '#7f2b12',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
