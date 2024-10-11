<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";

  const tvRichText = tv({
    base: "stack-4",
  });

  type RichTextProps = {
    compName?: string;
    className?: string;
    html: string;
  } & VariantProps<typeof tvRichText>;

  const {
    compName = "RichText",
    className,
    html,
  }: RichTextProps = $props();

</script>

{#if html}
  <div
    data-comp={compName}
    data-testid={compName}
    class={tvRichText({ className })}
  >
    {@html html}
  </div>
{/if}
