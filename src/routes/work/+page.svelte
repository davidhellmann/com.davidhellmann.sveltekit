<script lang="ts">
  import type { PageData } from "./$types";
  import StackBlog from "$components/stack/Blog.svelte";
  import Headline from "$components/text/Headline.svelte";
  import RichText from "$components/text/RichText.svelte";
  import Seo from "$components/head/Seo.svelte";
  import { getFirstEntry } from "$utils/getFirstEntry";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let entry = getFirstEntry(data.entries);

  const cc = {
    heading: "span-content text-olkch-pink is-zoomInDown",
    text: "col-start-[col-3] col-end-[col-10] text-2xl is-zoomInDown",
    list: "span-popout z-10 @container",
    underline: "underline decoration-wavy decoration-4 decoration-accent-purple-400"
  };
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

{#if entry}
    {#if entry?.title}
      <Headline
        className={cc.heading}
        text={entry?.title}
        size="7xl"
        family="sans"
        weight="extrabold"
        data-waypoint
        data-waypoint-target
      />
    {/if}
{/if}


