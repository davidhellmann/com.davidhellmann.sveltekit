<script lang="ts">
  import type { PageData } from "./$types";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import Seo from "$components/head/Seo.svelte";
  import Lightbox from "$components/wrapper/Lightbox.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  const entry = getFirstEntry(data.entries);
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

{#if entry && entry?.__typename === "entryWorkSingle_Entry"}
  {#if entry?.title}
    {entry?.title}
  {/if}

  {#if entry?.images}
    <div class="span-content lg:span-popout @container">
      <Lightbox images={entry?.images} ratio={"aspect-landscape"} />
    </div>
  {/if}
{/if}

<style lang="postcss">
  /* Lightbox Styles */
  :global(.lg-container .lg-content) {
    top: 0 !important;
  }

  :global(.lg-container .lg-item) {
    overflow-y: scroll;
  }

  :global(.lg-container .lg-item img) {
    width: 100%;
    height: auto;
    border: 0.5rem solid transparent;
    box-sizing: border-box;
    max-width: 1600px !important;
    max-height: none !important;
  }
</style>
