<script lang="ts">
  import {parseSEO, type ISEO, type IParseSEO} from "$lib/utils/parseSEO";

  interface Props {
    seo: IParseSEO;
  }

  let { seo }: Props = $props();
  const seomatic: ISEO = parseSEO(seo);
</script>

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
        {@html `<script type="application/ld+json">${JSON.stringify(item)}</script>`}
      {/each}
    {/if}
  {/if}
</svelte:head>
