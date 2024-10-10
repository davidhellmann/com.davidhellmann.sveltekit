<script lang="ts">
  import { tv } from "tailwind-variants";

  const tvPlainText = tv({
    base: "",
  });

  export let compName: string = "PlainText";
  export let className: string;
  export let text: string;
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
