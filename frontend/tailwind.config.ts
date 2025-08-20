import type { Config } from "tailwindcss";
import { tailwindTheme } from "./app/(styles)/theme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: tailwindTheme,
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
};

export default config;
