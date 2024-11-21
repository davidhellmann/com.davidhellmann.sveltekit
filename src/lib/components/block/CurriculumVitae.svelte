<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import type { Matrix_CurriculumVitaeFragment } from "$graphql/graphql";
  import Image from "$components/image/Image.svelte";
  import DecorativeWrapper from "$components/wrapper/DecorativeWrapper.svelte";


  const tvCurriculumVitae = tv({
    base: ""
  });

  type CurriculumVitaeProps = {
    compName?: string;
    className?: string;
    items: Matrix_CurriculumVitaeFragment[];
  } & VariantProps<typeof tvCurriculumVitae>;

  let {
    compName = "CurriculumVitae",
    className,
    items,
    ...rest
  }: CurriculumVitaeProps = $props();

</script>

{#if items}
  <div class={tvCurriculumVitae({ className })} data-comp={compName} {...rest}>
    {#each items as item (item.id)}
      {#if item.__typename === "blockCurriculumVitae_Entry"}
        <DecorativeWrapper preset="glass-white">
          {#if item?.company?.[0].__typename === "entryCompany_Entry" && item.company?.[0]?.title}
            {item.company[0].title}
            <!--{#if item.company[0].image?.[0]}-->
            <!--  <Image src={item.company[0].image[0].url} />-->
            <!--{/if}-->
          {/if}
        </DecorativeWrapper>
      {/if}
    {/each}
  </div>
{/if}
