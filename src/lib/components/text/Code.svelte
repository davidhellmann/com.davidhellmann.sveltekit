<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import { useShiki } from "$lib/actions/action.shiki";
  import Figure from "$components/blocks/Figure.svelte";

  const tvCode = tv({
    slots: {
      slotWrapper: "mt-10",
      slotCode:
        "flex items-center gap-3 label text-xs text-neutral-200 px-4 !-mb-8 md:!-mb-fluid -mt-10 py-2 ml-fluid rounded-t-xl self-start after:size-2 after:bg-accent-purple-400 after:rounded-full"
    }
  });

  type CodeProps = {
    compName?: string;
    className?: string;
    code: string;
    language: string;
    name?: string;
    html?: string;
  } & VariantProps<typeof tvCode>;

  const { compName = "Code", className, code, language = "js", name, html }: CodeProps = $props();

  const { slotWrapper, slotCode } = tvCode({ className });
</script>

{#if code && language}
  <div data-comp={compName} class={slotWrapper({ className })}>
    <Figure {html}>
      {#if name}
        <span class={slotCode()}>{name}</span>
      {/if}
      <div use:useShiki={{ code, language }}></div>
    </Figure>
  </div>
{/if}

<style>
  @reference "../../styles/app.css";
  [data-comp="Code"] .label {
    background-color: #262335;
  }

  [data-comp="Code"] :global(pre) {
    padding: 0;
    overflow-x: scroll;
    border-radius: 0.875rem;
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
    width: 3rem;
    text-align: right;
    margin-right: 0.5rem;
    padding-right: 0.5rem;
    display: inline-block;
    color: rgba(255, 255, 255, 0.2);
  }

  @screen lg {
    [data-comp="Code"] :global(code .line::before) {
      border-right: 1px solid rgba(255, 255, 255, 0.2);
      width: 5rem;
      margin-right: 1.5rem;
      padding-right: 1rem;
    }
  }

  [data-comp="Code"] :global(code .line:first-of-type::before) {
    padding-top: 1rem;
  }

  [data-comp="Code"] :global(code .line:last-of-type::before) {
    padding-bottom: 1rem;
  }
</style>
