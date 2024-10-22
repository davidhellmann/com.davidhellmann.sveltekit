<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import type { Asset_CustomFieldsFragment, Asset_DataFragment, Asset_TransformsFragment } from "$graphql/graphql";

  type ObjectFit = "cover" | "contain" | "fill" | "none" | "scale-down";
  type Asset = Asset_DataFragment & Asset_TransformsFragment & Asset_CustomFieldsFragment;

  const tvImage = tv({
    base: "bg-primary-200 w-full",
    variants: {
      ratio: {
        "aspect-auto": "aspect-auto",
        "aspect-landscape": "aspect-landscape",
        "aspect-portrait": "aspect-portrait",
        "aspect-square": "aspect-square"
      }
    },
    defaultVariants: {
      ratio: "aspect-landscape"
    }
  });

  type ImageProps = {
    compName?: string;
    className?: string;
    image?: Asset;
    lazy?: boolean;
    objectFit?: ObjectFit;
    focalPoint?: number[];
    alt?: string;
    srcset?: string;
    src?: string;
    blurhash?: string;
    width?: number;
    height?: number;
    noscript?: boolean;
    decorative?: boolean;
  } & VariantProps<typeof tvImage> & (VariantProps<typeof tvImage>["ratio"] | (string & {}));

  let {
    compName = "Image",
    className,
    image = undefined,
    lazy = true,
    objectFit = "cover",
    ratio = "aspect-landscape",
    alt = "",
    focalPoint,
    src,
    srcset,
    blurhash,
    width,
    height,
    noscript = true,
    decorative = false
  }: ImageProps = $props();

  // Set Focal Point
  const focalPointCoordinates = {
    x: image?.focalPoint?.[0] || focalPoint?.[0] || 0.5,
    y: image?.focalPoint?.[1] || focalPoint?.[1] || 0.5
  };

  // Set Role presentation for decorative images
  const role = decorative ? "presentation" : undefined;

  src = image?.url ?? src;
  width = image?.width ?? width;
  height = image?.height ?? height;
  srcset = image?.srcset ?? srcset;
  blurhash = image?.base64BlurHash ?? blurhash;
  alt = !decorative ? (image?.alt ?? image?.title ?? alt) : "";
  lazy = !src ? false : lazy;

  const attr = {
    width,
    height,
    style: `object-fit: ${objectFit}; object-position: ${focalPointCoordinates.x * 100}% ${focalPointCoordinates.y * 100}%;`
  };
</script>

{#snippet noScriptTag()}
  <noscript>
    <img src={src} alt={alt} />
  </noscript>
{/snippet}

{#snippet imgTag()}
  <img
    data-comp={compName}
    class={tvImage({ ratio, className })}
    {...attr}
    alt={alt}
    src={lazy && blurhash ? blurhash : src}
    srcSet={!lazy ? srcset : undefined}
    data-src={lazy && !srcset ? src : null}
    data-srcset={lazy && srcset ? srcset : null}
    loading={lazy ? "lazy" : "eager"}
    sizes={!lazy ? "auto" : undefined}
    data-sizes={lazy ? "auto" : undefined}
    role={role}
    data-lazy={lazy ? true : undefined}
  />
{/snippet}

{@render imgTag()}
{#if noscript}
  {@render noScriptTag()}
{/if}
