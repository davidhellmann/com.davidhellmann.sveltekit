<script lang="ts">
  import { tv, type VariantProps } from "$utils/classNames";

  const tvExif = tv({
    slots: {
      slotRoot: "text-2xs @xs:text-xs font-mono flex flex-col justify-between",
      slotCamera: "",
      slotSettings: "grid grid-cols-2 border-l-1 border-t-1 *:border-b-1 *:border-r-1 *:px-1.5 *:py-0.5 border-neutral-200 *:border-neutral-200"
    },
    variants: {
      spacing: {
        default: {
          slotRoot: "gap-x-8",
          slotCamera: "flex gap-x-4",
        },
        compact: {
          slotRoot: "gap-x-4",
          slotCamera: "flex gap-x-2",
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
    exif?: string;
    showCamera?: boolean;
    showSettings?: boolean;
  } & VariantProps<typeof tvExif>;

  const { compName = "Exif", className, exif, spacing = "default", showCamera = true, showSettings = true }: ExifProps = $props();
  let exifParsed: Exif = $state(undefined);

  if (exif) {
    exifParsed = JSON.parse(exif);
  }

  const { slotRoot, slotCamera, slotSettings } = tvExif();
</script>

{#if exif}
  <div data-comp={compName} class={slotRoot({ spacing, className })}>
    {#if showCamera}
      <div class={slotCamera({ spacing })}>
        {#if exifParsed?.cameraMake && exifParsed.cameraModel && exifParsed.lensModel}
          <span
            >{#if exifParsed.lensModel.includes(exifParsed.cameraModel)}{exifParsed.cameraMake}
            {/if}
            {exifParsed.cameraModel}</span
          >
          <!-- {#if !exifParsed.lensModel.includes(exifParsed.cameraModel)}<span>{exifParsed.lensModel}</span>{/if} -->
        {/if}
      </div>
    {/if}
    {#if showSettings}
      <div class={slotSettings({ spacing })}>
        {#if exifParsed?.focalLength}
          <span>{exifParsed?.focalLength}</span>
        {/if}
        {#if exifParsed?.aperture}
          <span>{exifParsed?.aperture}</span>
        {/if}
        {#if exifParsed?.shutterSpeed}
          <span>{exifParsed?.shutterSpeed}</span>
        {/if}
        {#if exifParsed?.iso}
          <span>ISO{exifParsed?.iso}</span>
        {/if}
      </div>
    {/if}
  </div>
{/if}
