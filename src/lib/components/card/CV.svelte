<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import Headline from "$components/text/Headline.svelte";
  import Time from "$components/text/Time.svelte";
  import InlineSvg from "$components/ui/InlineSvg.svelte";

  const tvCardCV = tv({
    slots: {
      slotBase: `
        group hover:bg-olkch-orange rounded-2xl flex flex-col md:flex-row items-center p-8 md:p-fluid gap-fluid
        text-neutral-50 bg-neutral-950
      `,
      slotLogo: "size-32 lg:size-48 aspect-square bg-neutral-50 text-neutral-950 p-4 rounded-full",
      slotContent: "flex flex-col text-center md:text-left",
      slotMeta: "flex items-center justify-center md:justify-start gap-2 text-olkch-green group-hover:text-neutral-50",
      slotLink: "text-olkch-green group-hover:text-neutral-50 underline font-mono text-sm"
    }
  });

  type CardCVProps = {
    compName?: string;
    className?: string;
    position: string;
    dateStart: string;
    dateEnd?: string;
    currentPosition: boolean;
    company: string;
    companyUrl: string;
    companyLogoMonochrome: string;
  } & VariantProps<typeof tvCardCV>;

  let {
    compName = "CardCV",
    className,
    position,
    dateStart,
    dateEnd,
    currentPosition,
    company,
    companyUrl,
    companyLogoMonochrome
  }: CardCVProps = $props();

  const { slotBase, slotLogo, slotContent, slotMeta, slotLink } = tvCardCV({ className });
</script>

{#if position && companyLogoMonochrome}
  <div class={slotBase({ className })} data-comp={compName} data-waypoint-target>
    <InlineSvg className={slotLogo()} url={companyLogoMonochrome} />
    <div class={slotContent()}>
      <Headline preset={"h2"} text={position} />
      <div class={slotMeta()}>
        <Time timestamp={dateStart} format="MM/YYYY" icon={false} />
        {#if dateEnd && !currentPosition}
          &mdash; <Time timestamp={dateEnd} format="MM/YYYY" icon={false} />
        {/if}

        {#if currentPosition}
          &mdash; <Time text={"Present"} icon={false} />
        {/if}
      </div>

      {#if company && companyUrl}
        <a class={slotLink()} title={company} href={companyUrl}>{companyUrl}</a>
      {/if}
    </div>
  </div>
{/if}
