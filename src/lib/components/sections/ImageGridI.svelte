<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import Image from "$components/media/Image.svelte";
  import type { ComponentProps } from "svelte";

  const tvImageGridI = tv({
    slots: {
      slotBase: "grid grid-cols-4 grid-rows-4",
      slotImage1: "grid-row-start-1 grid-row-end-2 grid-col-start-1 grid-col-end-2",
      slotImage2: "grid-row-start-1 grid-row-end-2 grid-col-start-2 grid-col-end-3",
      slotImage3: "grid-row-start-2 grid-row-end-3 grid-col-start-1 grid-col-end-2",
      slotImage4: "grid-row-start-2 grid-row-end-3 grid-col-start-2 grid-col-end-3"
    }
  });

  type ImageGridIProps = {
    compName?: string;
    className?: string;
    images: ComponentProps<typeof Image>["image"][];
  } & VariantProps<typeof tvImageGridI>;

  let { compName = "ImageGridI", className, images, ...rest }: ImageGridIProps = $props();

  const { slotBase, slotImage1, slotImage2, slotImage3, slotImage4 } = tvImageGridI();
</script>

{#if images}
  <div class={slotBase({ className })} data-comp={compName} {...rest}>
    {#if images[0]}
      <Image image={images[0]} ratio="aspect-auto" className={slotImage1({ className })} />
    {/if}
    <!-- {#if images[1]}
      <Image image={images[1]} ratio="aspect-auto" className={slotImage2({ className })} />
    {/if}
    {#if images[2]}
      <Image image={images[2]} ratio="aspect-auto" className={slotImage3({ className })} />
    {/if}
    {#if images[3]}
      <Image image={images[3]} ratio="aspect-auto" className={slotImage4({ className })} />
    {/if} -->
  </div>
{/if}
