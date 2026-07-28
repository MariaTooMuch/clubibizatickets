import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f4f5f4",
          100: "#e6e7e4",
          200: "#c9cbc5",
          300: "#a3a69c",
          400: "#787c70",
          500: "#5a5d51",
          600: "#45473d",
          700: "#363731",
          800: "#232420",
          900: "#171712",
        },
        sand: {
          50: "#fdfbf7",
          100: "#f8f2e7",
          200: "#efe2c9",
          300: "#e4cea3",
          400: "#d4b378",
          500: "#c39a56",
          600: "#a97e42",
          700: "#8a6337",
          800: "#6f4f30",
          900: "#5c4229",
        },
        terracotta: {
          50: "#fbf3ee",
          100: "#f4ded2",
          200: "#e6b8a0",
          300: "#d68f6d",
          400: "#c26e47",
          500: "#a8552f",
          600: "#8a4324",
          700: "#6d341c",
          800: "#552817",
          900: "#3d1c10",
        },
        olive: {
          50: "#f4f5ee",
          100: "#e4e7d3",
          200: "#c8cea9",
          300: "#a8b27e",
          400: "#889459",
          500: "#6d7a42",
          600: "#556134",
          700: "#434c29",
          800: "#343a20",
          900: "#282c18",
        },
        aegean: {
          50: "#eef3f4",
          100: "#d3e0e2",
          200: "#a8c2c6",
          300: "#7aa2a8",
          400: "#537f87",
          500: "#3d646c",
          600: "#2f4f56",
          700: "#263f45",
          800: "#1c2f33",
          900: "#141f23",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        wide: "0.06em",
        widest: "0.16em",
      },
      maxWidth: {
        content: "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
