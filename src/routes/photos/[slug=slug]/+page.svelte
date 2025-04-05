<script lang="ts">
  import type { PageData } from "./$types";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import Seo from "$components/seo/Seo.svelte";
  import HeroBlog from "$components/heros/Blog.svelte";
  import Exif from "$components/text/Exif.svelte";
  import ContentBuilder from "$components/builders/ContentBuilder.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const entry = getFirstEntry(data.entries);
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

{#if entry && entry?.__typename === "entryPhotosSingle_Entry"}
  {#if entry?.title}
    <HeroBlog
      headline={entry?.customTitle ?? entry.title}
      backButton={{
        title: "Blog overview",
        url: "/blog"
      }}
    />
  {/if}

  {#if entry?.images}
    <ul class="span-content">
      {#each entry?.images as image, i (image.id)}
        <li class="p-4 stack-4 @container">
          <img src={image?.url} alt={image?.alt} />
          {#if image?.exif}
            <Exif exif={image?.exif} />
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
{/if}
