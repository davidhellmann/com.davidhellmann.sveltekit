<script lang="ts">
  import { page } from "$app/state";
  import { parseSEO, type ISEO, type IParseSEO } from "$lib/utils/parseSEO";

  interface Props {
    seo: IParseSEO;
  }

  let { seo }: Props = $props();
  const seomatic: ISEO = parseSEO(seo);

  // Markdown alternate for LLM/agent consumers.
  // Pages that also exist under /ai/<path>.md advertise the link in <head>.
  const aiAlternate = $derived.by(() => {
    const path = page.url.pathname.replace(/\/$/, "");
    const m = path.match(/^\/(blog|work)\/([^/]+)$/);
    if (m) return `/ai/${m[1]}/${m[2]}.md`;
    if (path === "/about") return "/ai/about.md";
    return null;
  });
</script>

<svelte:head>
  {#if seomatic}
    <title>{seomatic.seoTitle}</title>

    {#if seomatic.meta}
      {#each seomatic.meta as item (item)}
        <meta {...item} />
      {/each}
    {/if}

    {#if seomatic.links}
      {#each seomatic.links as item (item)}
        <link {...item} />
      {/each}
    {/if}

    {#if seomatic?.jsonLd}
      {#each seomatic.jsonLd as item (item)}
        {@html `<script type="application/ld+json">${JSON.stringify(item)}</script>`}
      {/each}
    {/if}
  {/if}

  {#if aiAlternate}
    <link rel="alternate" type="text/markdown" href={aiAlternate} />
  {/if}
</svelte:head>
