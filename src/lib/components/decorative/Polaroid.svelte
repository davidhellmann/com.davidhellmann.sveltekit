<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import type { Snippet } from "svelte";
  import Tape from "$components/decorative/Tape.svelte";
  import type { HTMLAttributes } from "svelte/elements";

  const tvPolaroid = tv({
    slots: {
      slotBase: "flex flex-col flex-wrap relative h-full z-20",
      slotTape: "left-1/2 -translate-x-1/2 top-0 z-50 origin-center scale-80 md:scale-100"
    },
    variants: {
      preset: {
        polaroid: {
          slotBase: `
            [&:nth-child(-n+2)]:z-30
            bg-neutral-900
            shadow-2xl
            shadow-neutral-700/30
          `
        }
      }
    },
    defaultVariants: {
      preset: "polaroid"
    }
  });

  type PolaroidProps = {
    compName?: string;
    className?: string | undefined;
    children: Snippet;
  } & VariantProps<typeof tvPolaroid> &
    HTMLAttributes<HTMLDivElement>;

  const { compName = "Polaroid", className, preset, children, ...rest }: PolaroidProps = $props();
  const { slotBase, slotTape } = tvPolaroid({ preset, className });
</script>

{#if children}
  <div data-comp={compName} class={slotBase({ preset, className })} {...rest}>
    {@render children()}
    <Tape className={slotTape()} />
  </div>
{/if}
