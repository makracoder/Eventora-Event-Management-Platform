/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FAF7F2',
        ink: '#11131A',
        coral: '#FF5A36',
        gold: '#FFC145',
      },
      fontFamily: {
        display: ['Archivo Black', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}