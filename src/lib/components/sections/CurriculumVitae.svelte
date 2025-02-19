<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import type { Matrix_CurriculumVitaeFragment } from "$graphql/graphql";
  import CardCV from "$components/cards/CV.svelte";

  const tvCurriculumVitae = tv({
    base: "flex flex-col gap-1"
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
        {#if item?.company?.[0].__typename === "entryCompany_Entry" && item.company?.[0]}
          <CardCV
            position={item?.position ?? ""}
            dateStart={item?.dateStart}
            dateEnd={item?.dateEnd}
            currentPosition={item?.currentPosition ?? false}
            company={item.company[0].title}
            companyUrl={item.company[0].hyperLink[0]?.url}
            location={item?.location}
            logoSvgCode={item.company[0].logoMonochrome[0]?.svgCode}
          />
        {/if}
      {/if}
    {/each}
  </div>
{/if}
