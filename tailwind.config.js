/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        surface: "#FFFFFF",
        primary: "#8B5CF6",
        secondary: "#F472B6",
        text: "#1E293B",
        muted: "#94A3B8",
        energy: {
          low: "#FCA5A5",
          medium: "#FDE047",
          high: "#86EFAC",
        }
      }
    },
  },
  plugins: [],
}

