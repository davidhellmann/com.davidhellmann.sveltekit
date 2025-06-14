import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  kit: {
    // Using Node adapter for server-side rendering and preview support
    adapter: adapter({
      out: 'build'
    }),
    prerender: {
      handleMissingId: "warn",
      crawl: false,
      concurrency: 2
    },
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
