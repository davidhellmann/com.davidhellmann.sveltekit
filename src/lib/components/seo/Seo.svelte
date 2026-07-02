<script lang="ts">
  import { page } from "$app/state";
  import { getMarkdownAlternate } from "$lib/ai/markdown-alternate";
  import { parseSEO, type ISEO, type IParseSEO } from "$lib/utils/parseSEO";

  interface Props {
    seo: IParseSEO;
  }

  let { seo }: Props = $props();
  const seomatic: ISEO = parseSEO(seo);

  // Markdown alternate for LLM/agent consumers.
  const markdownAlternate = $derived.by(() => {
    return getMarkdownAlternate(page.url.pathname);
  });

  const jsonLdScript = (item: unknown) => `<script type="application/ld+json">${JSON.stringify(item)}<${"/script"}>`;
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
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html jsonLdScript(item)}
      {/each}
    {/if}
  {/if}

  {#if markdownAlternate}
    <link rel="alternate" type="text/markdown" href={markdownAlternate} />
  {/if}
</svelte:head>
