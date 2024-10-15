import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import ViteSvgSpriteWrapper from "vite-svg-sprite-wrapper";

const IconSpritss = ["remixicon"];

export default defineConfig({
  plugins: [
    sveltekit(),
    ...IconSpritss.map((icon) => {
      return ViteSvgSpriteWrapper({
        icons: `static/icons/${icon}/*.svg`,
        outputDir: `static/icons/sprites/${icon}/`,
        generateType: true,
        typeName: `${icon.charAt(0).toUpperCase()}${icon.slice(1)}Icons`,
        typeFileName: `${icon}-icons`,
        typeOutputDir: "./src/lib/types/"
      });
    })
  ],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"]
  }
});