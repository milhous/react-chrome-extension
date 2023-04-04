/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        inherit: "inherit",
        transparent: "transparent",
        currentColor: "currentColor",
        white: "#fff",
        black: "#000",
        "primary-blue": "#347AF0",
        "midnight-blue": "#0D1F3C",
        green: "#75BF72",
        red: "#DF5060",
        yellow: "#FDB32A",
        "dark-gray": "#3D4C63",
        gray: "#B5BBC9",
        "light-gray": "#CFD2D8",
      },
    },
  },
  plugins: [],
};
