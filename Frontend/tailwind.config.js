module.exports = {
  // ...existing config
  theme: {
    extend: {
      // ...existing extends
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
    },
  },
  plugins: [
    // ...existing plugins
    require('tailwind-scrollbar'),
  ],
};