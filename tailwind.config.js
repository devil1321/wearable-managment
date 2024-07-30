/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.{ejs,html}',          // All EJS and HTML files in views directory and its subdirectories
    './public/**/*.{html,js}',          // All HTML and JS files in public directory and its subdirectories
    './views/partials/**/*.{ejs,html}',
    './views/partials/**/**/*.{ejs,html}' // All EJS and HTML files in views/partials directory and its subdirectories
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}