<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import type { Snippet } from "svelte";
  import Tape from "$components/ui/Tape.svelte";

  const tvDecorativeWrapper = tv({
    slots: {
      slotBase: "",
      slotTape: "",
    },
    variants: {
      preset: {
        unset: {
          slotBase: "",
        },
        "glass-white": {
          slotBase: `
            isolate
            relative
            z-10
            bg-white/50 backdrop-blur
            shadow-md
            ring-1
            ring-black/5
            rounded-3xl
          `
        },
        "polaroid": {
          slotBase: `
            flex
            flex-col
            flex-wrap
            h-full
            relative
            z-20
            [&:nth-child(-n+2)]:z-30
            bg-neutral-100
            px-3
            pt-4
            pb-4
            shadow-md
            ring-1
            ring-black/5
            rounded-sm
            border-b-[1px]
            border-neutral-400
          `
        },
        "glass-home": {
          slotBase: `
            isolate
            relative
            z-10
            bg-gradient-to-b
            from-transparent
            to-neutral-900/10
            backdrop-blur-lg
            ring-1
            ring-black/5
            rounded-3xl
          `
        },
      },
    },
    defaultVariants: {
      preset: "glass-white"
    }
  });

  type DecorativeWrapperProps = {
    compName?: string;
    className?: string | undefined;
    children: Snippet;
  } & VariantProps<typeof tvDecorativeWrapper>;

  const {
    compName = "DecorativeWrapper",
    className,
    preset,
    children,
  }: DecorativeWrapperProps = $props();

  const { slotBase } = tvDecorativeWrapper({preset, className});
</script>

{#if children}
  <div
    data-comp={compName}
    class={slotBase({ preset, className })}
  >
    {@render children()}

    {#if preset === "polaroid"}
      <Tape className="left-1/2 -translate-x-1/2 top-0 z-50" />
<!--      <Tape className="-right-5 bottom-8 z-50" />-->
    {/if}
  </div>
{/if}
