<script lang="ts">
  import type { PageProps } from "./$types";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import type {
    EntryType_PhotosSingleFragment,
    Entry_SeoFragment,
    Entry_PrevFragment,
    Entry_NextFragment
  } from "$graphql/graphql";
  import Seo from "$components/seo/Seo.svelte";
  import HeroPhotos from "$components/heros/Photos.svelte";
  import Image from "$components/media/Image.svelte";
  import LightboxPhotos from "$components/modals/LightboxPhotos.svelte";
  import PrevNext from "$components/navigation/PrevNext.svelte";
  import { getExifData } from "$utils/getExifData";

  let { data }: PageProps = $props();

  const entry = getFirstEntry(data.entries) as Entry_SeoFragment &
    EntryType_PhotosSingleFragment &
    Entry_PrevFragment &
    Entry_NextFragment;
</script>

{#if entry?.seomatic}
  <Seo seo={entry.seomatic} />
{/if}

{#if entry?.title && entry?.images}
  {@const exifDataParsed = getExifData(entry?.images)}
  <HeroPhotos imageCount={entry?.images?.length} headline={entry?.customTitle ?? entry.title} exif={exifDataParsed} />
{/if}

{#if entry?.images}
  <LightboxPhotos images={entry?.images} className="span-content" galleryId={entry.id || entry.slug} />
{/if}

<PrevNext prev={entry?.prev} next={entry?.next} theme="photos" className="span-content" />
