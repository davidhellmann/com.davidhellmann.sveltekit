<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";

  const tvExif = tv({
    slots: {
      slotRoot: "text-2xs @md:text-xs font-mono flex flex-col @md:flex-row justify-between",
      slotCamera: "",
      slotSettings: ""
    },
    variants: {
      spacing: {
        default: {
          slotRoot: "gap-x-8",
          slotCamera: "flex gap-x-4",
          slotSettings: "flex gap-x-8"
        },
        compact: {
          slotRoot: "gap-x-4",
          slotCamera: "flex gap-x-2",
          slotSettings: "flex gap-x-4"
        }
      }
    }
  });

  type Exif =
    | {
        focalLength: string;
        lensMake: string;
        lensModel: string;
        cameraMake: string;
        cameraModel: string;
        iso: string;
        aperture: string;
        focalLengthFilm: string;
        shutterSpeed: string;
        dateTime: string;
        dateTimeOriginal: string;
      }
    | undefined;

  type ExifProps = {
    compName?: string;
    className?: string;
    exif: string;
  } & VariantProps<typeof tvExif>;

  const { compName = "Exif", className, exif, spacing = "default" }: ExifProps = $props();
  let exifParsed: Exif = $state(undefined);

  if (exif) {
    exifParsed = JSON.parse(exif);
  }

  const { slotRoot, slotCamera, slotSettings } = tvExif();
</script>

{#if exif}
  <div data-comp={compName} class={slotRoot({ spacing, className })}>
    <div class={slotCamera({ spacing })}>
      {#if exifParsed?.cameraMake && exifParsed.cameraModel && exifParsed.lensModel}
        <span>{exifParsed?.cameraMake} {exifParsed.cameraModel}</span>
        <span>{exifParsed.lensModel}</span>
      {/if}
    </div>
    <div class={slotSettings({ spacing })}>
      {#if exifParsed?.iso}
        <span>ISO {exifParsed?.iso}</span>
      {/if}
      {#if exifParsed?.shutterSpeed}
        <span>{exifParsed?.shutterSpeed}</span>
      {/if}
      {#if exifParsed?.aperture}
        <span>{exifParsed?.aperture}</span>
      {/if}
      {#if exifParsed?.focalLength}
        <span>{exifParsed?.focalLength}</span>
      {/if}
    </div>
  </div>
{/if}
