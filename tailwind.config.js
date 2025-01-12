/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#397586",
        font: "#163341",
      },
      keyframes: {
        fly: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(calc(100vw + 100px))" },
        },
      },
      animation: {
        fly: "fly 15s linear infinite",
      },
    },
  },
  plugins: [],
};
