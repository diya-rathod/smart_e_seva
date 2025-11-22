/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- NEW VIBRANT PALETTE ---
        'primary-navy': '#0E1B44',     // Deep Navy
        'secondary-slate': '#344767',  // Slate Gray
        'primary-aqua': '#00A9E0',
        // --- End of New Palette ---
      },
      boxShadow: {
        // Soft Glass shadow for cards
        'glass-md': '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
      },
      animation: {
      spin: "spin 40s linear infinite",
    },
    },
  },
  plugins: [],
}