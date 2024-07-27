/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.{ejs,html}', // Update this path to match where your EJS templates are located
    './public/**/*.html', // Include paths where your static HTML files might be
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}