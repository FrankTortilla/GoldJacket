import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0a0f1e",
        gold: "#c9a84c",
        "gold-light": "#e8c96d",
        card: "#111827",
        "card-border": "#1f2937",
        white: "#f5f5f5",
      },
    },
  },
  plugins: [],
};

export default config;
