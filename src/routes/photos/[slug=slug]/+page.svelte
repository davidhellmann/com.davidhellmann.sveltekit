<script lang="ts">
  import type { PageData } from "./$types";
  import { getFirstEntry } from "$utils/getFirstEntry";
  import Seo from "$components/seo/Seo.svelte";
  import HeroBlog from "$components/heros/Blog.svelte";
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
        {@const exif = JSON.parse(image?.exif)}

        <li class="p-4 stack-4">
          <img src={image?.url} alt={image?.alt} />
          <!--
          'focalLength': focalLength,
          'lensMake': exifData['exif.UndefinedTag:0xA433'] ?? null,
          'lensModel': exifData['exif.UndefinedTag:0xA434'] ?? null,
          'cameraMake': exifData['ifd0.Make'] ?? null,
          'cameraModel': exifData['ifd0.Model'] ?? null,
          'iso': exifData['exif.ISOSpeedRatings'] ?? null,
          'aperture': aperture,
          'focalLengthFilm': focalLengthFilm,
          'shutterSpeed': shutterSpeed,
          'dateTime': exifData['ifd0.DateTime'] ?? null,
          'dateTimeOriginal': exifData['exif.DateTimeOriginal'] ?? null, -->
          <div class="text-xs font-mono flex justify-between gap-4">
            <div class="flex gap-4">
              {#if exif?.cameraMake && exif.cameraModel && exif.lensModel}
                <span>{exif?.cameraMake} {exif.cameraModel}</span>
                <span>{exif.lensModel}</span>
              {/if}
            </div>
            <div class="flex gap-8">
              {#if exif?.iso}
                <span>ISO {exif?.iso}</span>
              {/if}
              {#if exif?.shutterSpeed}
                <span>{exif?.shutterSpeed}</span>
              {/if}
              {#if exif?.aperture}
                <span>{exif?.aperture}</span>
              {/if}
              {#if exif?.focalLength}
                <span>{exif?.focalLength}</span>
              {/if}
            </div>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
{/if}
