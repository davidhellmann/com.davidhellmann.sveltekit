<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";

  const baseClasses = {
    size: "fixed h-screen w-full max-w-[2000px]  pointer-events-none",
    position: "left-1/2 top-0 -translate-x-1/2 z-[9999] px-fluid-grid-gap",
  };


  const tvGridLines = tv({
    base: `
      ${baseClasses.size}
      ${baseClasses.position}
      ${baseClasses.spacing}
    `,
    variants: {
      context: {
        blog: "border-neutral-500",
        home: "bg-[blue]"
      }
    }
  });

  type GridLinesProps = {
    compName?: string;
    className?: string;
  } & VariantProps<typeof tvGridLines>;

  let {
    compName = "GridLines",
    className,
    context = "blog"
  }: GridLinesProps = $props();

  const border = "border-x border-dashed border-neutral-400";
  const positon = "absolute inset-y-0 inset-x-fluid-grid-gap";
</script>

<div data-comp={compName} class={tvGridLines({ context, className })}>
  <div class={`${border} ${positon}`}>aa</div>
</div>

