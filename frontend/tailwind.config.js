/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
        },
        accent: "#0d9488",
        ink: {
          DEFAULT: "#1e293b",
          soft: "#64748b",
          900: "#1e293b",
          500: "#64748b",
        },
        bg: "#ffffff",
        surface: "#ffffff",
        line: "#e2e8f0",
        alert: "#ef4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};