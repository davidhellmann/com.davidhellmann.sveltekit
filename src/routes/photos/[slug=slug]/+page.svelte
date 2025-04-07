<script lang="ts">
  import type { PageData } from "./$types";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import Seo from "$components/seo/Seo.svelte";
  import HeroBlog from "$components/heros/Blog.svelte";
  import Exif from "$components/text/Exif.svelte";
  import Image from "$components/media/Image.svelte";
  import LightboxPhotos from "$components/modals/LightboxPhotos.svelte";

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
        title: "Photos",
        url: "/photos"
      }}
    />
  {/if}

  {#if entry?.images}
    <LightboxPhotos images={entry?.images} className="span-content" />
  {/if}
{/if}
