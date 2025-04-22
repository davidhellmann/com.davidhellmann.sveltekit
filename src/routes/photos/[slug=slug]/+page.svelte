<script lang="ts">
  import type { PageData } from "./$types";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import Seo from "$components/seo/Seo.svelte";
  import HeroPhotos from "$components/heros/Photos.svelte";
  import Image from "$components/media/Image.svelte";
  import LightboxPhotos from "$components/modals/LightboxPhotos.svelte";
  import { getExifData } from "$utils/getExifData";

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
  {#if entry?.title && entry?.images}
    {@const exifDataParsed = getExifData(entry?.images)}
    <HeroPhotos imageCount={entry?.images?.length} headline={entry?.customTitle ?? entry.title} exif={exifDataParsed} />
  {/if}

  {#if entry?.images}
    <LightboxPhotos images={entry?.images} className="span-content" />
  {/if}
{/if}
