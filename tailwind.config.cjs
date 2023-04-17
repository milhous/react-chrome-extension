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
        "primary-blue": "#0ea5e9",
        "midnight-blue": "#0f172a",
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
