<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";

  const tvPlainText = tv({
    base: "",
  });

  type PlainTextProps = {
    compName?: string;
    className?: string;
    text: string;
  } & VariantProps<typeof tvPlainText>;

  const {
    compName = "PlainText",
    className,
    text
  }: PlainTextProps = $props();

</script>

{#if text}
  <p
    data-comp={compName}
    data-testid={compName}
    class={tvPlainText({ className })}
  >
    {#each text.split("\n") as line}
      {line}
      <br />
    {/each}
  </p>
{/if}
