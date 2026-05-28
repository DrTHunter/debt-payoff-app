/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9f4",
          100: "#dcf1e3",
          200: "#bce3ca",
          300: "#8ccea7",
          400: "#56b07f",
          500: "#319562",
          600: "#22784e",
          700: "#1c6041",
          800: "#194d36",
          900: "#15402e",
        },
        warm: {
          50: "#fff8f1",
          100: "#ffecd6",
          200: "#ffd5a8",
          300: "#ffb56e",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
