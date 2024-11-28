import presetDefault from "tailwindcss/defaultConfig";
import presetBaukasten from "./src/lib/styles/tailwind/presets/baukasten.mjs";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [presetDefault, presetBaukasten],
  content: ["./src/**/*.{html,js,svelte,ts }"],
  darkMode: ["selector", "[data-theme='dark']"],
  theme: {
    extend: {}
  },
  plugins: []
};
