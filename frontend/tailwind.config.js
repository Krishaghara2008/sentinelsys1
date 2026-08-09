/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#080B10",
        panel: "#0F141C",
        "panel-raised": "#141A24",
        line: "#1E2733",
        "line-soft": "#161D28",
        cyan: {
          DEFAULT: "#2DD9E8",
          soft: "#8FEFF7",
          dim: "#164A52",
        },
        violet: {
          DEFAULT: "#8B7CF6",
          dim: "#2B2560",
        },
        ink: {
          DEFAULT: "#E7EDF4",
          muted: "#8B96A5",
          faint: "#4E5766",
        },
        healthy: "#34D399",
        monitor: "#5EC8E8",
        cleaning: "#F5B84C",
        maintenance: "#F5924C",
        critical: "#FF5C72",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(45,217,232,0.15), 0 0 24px -4px rgba(45,217,232,0.25)",
        "glow-violet": "0 0 0 1px rgba(139,124,246,0.15), 0 0 24px -4px rgba(139,124,246,0.25)",
        panel: "0 1px 0 0 rgba(255,255,255,0.02) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "28px 28px",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.45 },
        },
        rise: {
          "0%": { opacity: 0, transform: "translateY(6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 2.4s ease-in-out infinite",
        rise: "rise 0.35s ease-out",
      },
    },
  },
  plugins: [],
};
