import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import ViteSvgSpriteWrapper from "vite-svg-sprite-wrapper";
import tailwindcss from "@tailwindcss/vite";

const IconSpritss = ["heroicons"];

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    ...IconSpritss.map((icon) => {
      return ViteSvgSpriteWrapper({
        icons: `static/icons/${icon}/*.svg`,
        outputDir: `static/icons/sprites/${icon}/`,
        generateType: true,
        sprite: {
          shape: {
            transform: [
              {
                svgo: {
                  plugins: [
                    { name: "preset-default" },
                    {
                      name: "removeAttrs",
                      params: {
                        attrs: ["*:(data-*|style|class):*"]
                      }
                    },
                    {
                      name: "convertColors",
                      params: {
                        currentColor: true
                      }
                    },
                    "removeXMLNS"
                  ]
                }
              }
            ]
          }
        },
        typeName: `${icon.charAt(0).toUpperCase()}${icon.slice(1)}Icons`,
        typeFileName: `${icon}-icons`,
        typeOutputDir: "./src/lib/types/"
      });
    })
  ],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"]
  },
  server: {
    host: "davidhellmann.sveltekit.test",
    port: 5173
  }
});
