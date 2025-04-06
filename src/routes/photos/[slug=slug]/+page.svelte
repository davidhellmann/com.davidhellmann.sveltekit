<script lang="ts">
  import type { PageData } from "./$types";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import Seo from "$components/seo/Seo.svelte";
  import HeroBlog from "$components/heros/Blog.svelte";
  import Exif from "$components/text/Exif.svelte";
  import Image from "$components/media/Image.svelte";

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
    <ul class="span-content grid md:grid-cols-2 xl:grid-cols-3 gap-fluid items-center">
      {#each entry?.images as image, i (image.id)}
        <li class="stack-4 @container flex-col flex items-center">
          <Image ratio="aspect-auto" className="w-full" noscript={false} {image} />
          {#if image?.exif}
            <Exif className="w-full" exif={image?.exif} />
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
{/if}
