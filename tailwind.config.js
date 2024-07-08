/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,svelte}", "./src/app.html"],
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 0.8s ease-in forwards',
        fadeOut: 'fadeOut 0.8s ease-in forwards',
        slideInFromTop: 'slideInFromTop 1s ease-out forwards',
        slideInFromBottom: 'slideInFromBottom 1s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInFromTop: {
          '0%': { transform: 'translateY(-50%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInFromBottom: {
          '0%': { transform: 'translateY(50%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      fontFamily: {
        noto: ["Noto Sans JP"],
        roboto: ["Roboto", "sans-serif"],
        openSans: ["Open Sans", "sans-serif"],
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        ".text-shadow-flowing": {
          textShadow: "1px 1px 4px white, -1px 1px 4px white, 1px -1px 4px white, -1px -1px 4px white",
        },
        ".text-shadow-none": {
          textShadow: "none",
        },
      };
      addUtilities(newUtilities);
    },
  ],
}
