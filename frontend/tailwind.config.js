/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        autofill: '#1E293B', // Background color for autofill
        autofillText: '#E2E8F0', // Text color for autofill
        glass: 'var(--glass)', 
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Add this plugin for form styling
  ],
};
