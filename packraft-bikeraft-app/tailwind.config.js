// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          black: '#000000',
          white: '#ffffff',
          'non-photo-blue': '#92dce5',
          'lavender-blush': '#eee5e9',
          'gray': '#7c7c7c',
          'chili-red': '#d64933',
        },
      },
    },
    plugins: [],
  }