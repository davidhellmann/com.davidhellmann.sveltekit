<script lang="ts">
  import {parseSEO, type ISEO, type IParseSEO} from "$lib/utils/parseSEO";

  interface Props {
    seo: IParseSEO;
  }

  let { seo }: Props = $props();
  const seomatic: ISEO = parseSEO(seo);
</script>

{#snippet jsonLD(json: Record<string, any>)}
  <script type="application/ld+json">
    {JSON.stringify(json)}
  </script>
{/snippet}

<svelte:head>
  {#if seomatic}
    <title>{seomatic.seoTitle}</title>

    {#if seomatic.meta}
      {#each seomatic.meta as item (item)}
        <meta {...item}/>
      {/each}
    {/if}

    {#if seomatic.links}
      {#each seomatic.links as item (item)}
        <link {...item}/>
      {/each}
    {/if}

    {#if seomatic?.jsonLd}
      {#each seomatic.jsonLd as item (item)}
        {@render jsonLD(item)}
      {/each}
    {/if}
  {/if}
</svelte:head>
