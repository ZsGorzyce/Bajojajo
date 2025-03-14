const { heroui } = require('@heroui/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Ensure the paths point to all your components and the root `node_modules` for @heroui/theme
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    // Add your own paths to Tailwind's content (like app pages, components, etc.)
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class', // Allows dark mode with a class
  plugins: [heroui()],
};
