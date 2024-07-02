/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./src/**/*.{js,ts,svelte}", "./src/app.html"],
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 1.5s ease-in forwards',
        fadeOut: 'fadeOut 1.5s ease-in forwards',
        slideIn: 'slideIn 1.5s ease-out forwards',
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
        slideIn: {
          '0%': { transform: 'translateX(-25%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      fontFamily: {
        noto: ["Noto Sans JP"],
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        ".text-shadow-flowing": {
          textShadow: "1px  1px 4px white, -1px  1px 4px white, 1px -1px 4px white, -1px -1px 4px white"
        },
        ".text-shadow-none": {
          textShadow: "none"
        }
      };
      addUtilities(newUtilities);
    }
  ],
}
