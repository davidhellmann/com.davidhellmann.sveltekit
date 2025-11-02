<script module lang="ts">
  export type Asset = Asset_DataFragment & Asset_TransformsFragment & Asset_CustomFieldsFragment;
</script>

<script lang="ts">
  import { useUnlazy } from "$lib/actions/action.unlazy";
  import { tv, type VariantProps } from "tailwind-variants";
  import type { Asset_CustomFieldsFragment, Asset_DataFragment, Asset_TransformsFragment } from "$graphql/graphql";
  import { ComponentProps } from "svelte";

  type ObjectFit = "cover" | "contain" | "fill" | "none" | "scale-down";

  const tvImage = tv({
    base: "bg-primary-200 w-full aspect-landscape",
    variants: {
      animate: {
        unset: "",
        fade: "[&[data-srcset]]:blur-xl [&[data-srcset]]:scale-110 transition-all ease-in duration-500"
      }
    },
    defaultVariants: {
      ratio: "aspect-landscape",
      animate: "unset"
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
    index?: number | undefined;
  } & VariantProps<typeof tvImage>;

  let {
    compName = "Image",
    className,
    image = undefined,
    lazy = true,
    objectFit = "cover",
    animate,
    alt = "",
    focalPoint,
    src,
    srcset,
    blurhash,
    width,
    height,
    noscript = true,
    decorative = false,
    index = undefined
  }: ImageProps = $props();

  // Set Focal Point
  const focalPointCoordinates = {
    x: focalPoint?.[0] ?? image?.focalPoint?.[0] ?? 0.5,
    y: focalPoint?.[1] ?? image?.focalPoint?.[1] ?? 0.5
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
    <img {src} {alt} />
  </noscript>
{/snippet}

{#snippet imgTag()}
  <img
    data-index={index}
    data-comp={compName}
    class={tvImage({ animate, className })}
    {...attr}
    {alt}
    src={lazy && blurhash ? blurhash : src}
    srcSet={!lazy ? srcset : undefined}
    data-src={lazy && !srcset ? src : null}
    data-srcset={lazy && srcset ? srcset : null}
    loading={lazy ? "lazy" : "eager"}
    data-sizes={lazy ? "auto" : "auto"}
    {role}
    data-lazy={lazy ? true : undefined}
    use:useUnlazy={lazy}
  />
{/snippet}

{@render imgTag()}
{#if noscript}
  {@render noScriptTag()}
{/if}
