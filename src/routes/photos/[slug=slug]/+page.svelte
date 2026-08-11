<script lang="ts">
  import type { PageProps } from "./$types";
  import Seo from "$components/seo/Seo.svelte";
  import HeroPhotos from "$components/heros/Photos.svelte";
  import LightboxPhotos from "$components/modals/LightboxPhotos.svelte";
  import PrevNext from "$components/navigation/PrevNext.svelte";
  import { getExifData } from "$utils/getExifData";

  let { data }: PageProps = $props();

  const entry = $derived(data.entry);
  const exifDataParsed = $derived(entry?.images ? getExifData(entry.images) : undefined);
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

{#if entry?.title && entry?.images}
  <HeroPhotos imageCount={entry?.images?.length} headline={entry?.customTitle ?? entry.title} exif={exifDataParsed} />
{/if}

{#if entry?.images}
  <LightboxPhotos images={entry?.images} className="span-content" galleryId={entry.id || entry.slug} />
{/if}

<PrevNext prev={entry?.prev} next={entry?.next} theme="photos" className="span-content" />
