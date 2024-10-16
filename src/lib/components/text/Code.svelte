<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import { getShikiCode } from "$lib/utils/getShikiCode";

  const tvCode = tv({
    base: "",
  });

  type CodeProps = {
    compName?: string;
    className?: string;
    code: string;
    language: string;
  } & VariantProps<typeof tvCode>;

  const {
    compName = "Code",
    className,
    code,
    language
  }: CodeProps = $props();

  const shikiCode = getShikiCode(code, language);
</script>

{#if shikiCode}
  <div
    data-comp={compName}
    class={tvCode({ className })}
  >
    {#if shikiCode}{@html shikiCode}{/if}
  </div>
{/if}

<style lang="postcss">
  [data-comp="Code"] :global(pre) {
    padding: 0 2rem;
    overflow-x: scroll;
  }

  [data-comp="Code"] :global(code) {
    counter-reset: step;
    width: 100%;
    counter-increment: step calc(var(--start, 1) - 1);
    font-size: 15px;
    line-height: 1.5;
    display: flex;
    flex-flow: column wrap;
  }

  [data-comp="Code"] :global(code .line::before) {
    content: counter(step);
    counter-increment: step;
    border-right: 1px solid rgba(255, 255, 255, .2);
    width: 5rem;
    text-align: right;
    margin-right: 1.5rem;
    padding-right: 1rem;
    display: inline-block;
    color: rgba(255,255,255,.2)
  }

  [data-comp="Code"] :global(code .line:first-of-type::before) {
    padding-top: 1rem;
  }

  [data-comp="Code"] :global(code .line:last-of-type::before) {
    padding-bottom: 1rem;
  }
</style>
