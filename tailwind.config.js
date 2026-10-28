/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'primary-green': '#056a42',
        'dark-green': '#033b24',
        'leaf-green': '#16a34a',
        'mint-light': '#f0fdf4',
      },
    },
  },
  plugins: [],
};