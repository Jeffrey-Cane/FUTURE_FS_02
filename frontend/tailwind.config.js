/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Space Grotesk", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#14120f",
        mute: "#4e4a43",
        cream: "#f6f0e6",
        sand: "#f6f0e6",
        clay: "#f4d5bf",
        tide: "#0f7f7a",
        sunset: "#f26b4f",
        dune: "#c7b9a5"
      },
      boxShadow: {
        card: "0 20px 45px -25px rgba(15, 12, 8, 0.35)",
        glow: "0 0 0 1px rgba(242, 107, 79, 0.2), 0 12px 32px -18px rgba(242, 107, 79, 0.6)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(14px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        fadeUp: "fadeUp 0.7s ease forwards"
      }
    },
  },
  plugins: [],
}

