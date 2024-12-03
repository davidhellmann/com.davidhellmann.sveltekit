<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import type { Matrix_CurriculumVitaeFragment } from "$graphql/graphql";
  import CardCV from "$components/card/CV.svelte";
  import DecorativeWrapper from "$components/wrapper/DecorativeWrapper.svelte";

  const tvCurriculumVitae = tv({
    base: ""
  });

  type CurriculumVitaeProps = {
    compName?: string;
    className?: string;
    items: Matrix_CurriculumVitaeFragment[];
  } & VariantProps<typeof tvCurriculumVitae>;

  let { compName = "CurriculumVitae", className, items, ...rest }: CurriculumVitaeProps = $props();
</script>

{#if items}
  <div class={tvCurriculumVitae({ className })} data-comp={compName} {...rest}>
    {#each items as item (item.id)}
      {#if item.__typename === "blockCurriculumVitae_Entry"}
        <DecorativeWrapper preset="glass-white">
          {#if item?.company?.[0].__typename === "entryCompany_Entry" && item.company?.[0]?.title}
            <CardCV
              position={item?.position ?? ""}
              dateStart={item?.dateStart}
              dateEnd={item?.dateEnd}
              currentPosition={item?.currentPosition ?? false}
              company={item.company[0].title}
              companyLogoMonochrome={item.company[0].logoMonochrome[0]?.url ?? ""}
            />
          {/if}
        </DecorativeWrapper>
      {/if}
    {/each}
  </div>
{/if}
