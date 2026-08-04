import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  compilerOptions: {
    warningFilter: (warning) => !warning.code.startsWith("state_referenced_locally")
  },
  kit: {
    adapter: adapter({
      out: "build",
      precompress: false
    }),
    alias: {
      $components: "src/lib/components",
      $graphql: "src/lib/graphql",
      $images: "src/lib/images",
      $styles: "src/lib/styles",
      $utils: "src/lib/utils"
    }
  }
};

export default config;
