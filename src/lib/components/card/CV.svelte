<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import Headline from "$components/text/Headline.svelte";
  import PlainText from "$components/text/PlainText.svelte";
  import Time from "$components/text/Time.svelte";
  import InlineSvg from "$components/ui/InlineSvg.svelte";

  const tvCardCV = tv({
    slots: {
      slotBase: `
        group hover:bg-neutral-50 hover:text-neutral-950 rounded-2xl flex flex-col
        items-center md:items-start md:flex-row p-12 lg:p-fluid gap-12 lg:gap-fluid text-neutral-50 bg-neutral-950

      `,
      slotLogo:
        "size-32 aspect-square bg-neutral-50 text-neutral-950 group-hover:text-neutral-50 group-hover:bg-neutral-950 px-4 flex items-center rounded-xl transition-all",
      slotContent: "flex flex-col text-center gap-y-4 md:gap-y-0 md:text-left",
      slotMeta:
        "flex items-center flex-wrap justify-center md:justify-start gap-x-4 text-neon-green group-hover:text-neutral-950",
      slotLink: "text-neon-green group-hover:text-neutral-950 underline font-mono text-sm"
    }
  });

  type CardCVProps = {
    compName?: string;
    className?: string;
    position: string;
    dateStart: string;
    dateEnd?: string;
    currentPosition: boolean;
    company?: string;
    companyUrl?: string;
    location?: string;
    logoSvgCode?: string;
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
    location,
    logoSvgCode
  }: CardCVProps = $props();

  const { slotBase, slotLogo, slotContent, slotMeta, slotLink } = tvCardCV({ className });
</script>

{#if position && logoSvgCode}
  <div class={slotBase({ className })} data-comp={compName} data-waypoint-target>
    <InlineSvg className={slotLogo()} svgCode={logoSvgCode} />

    <div class={slotContent()}>
      <Headline preset={"h2"} className={"group-hover:text-neutral-950"} text={position} />
      <div class={slotMeta()}>
        <div class={"flex gap-[1ch]"}>
          <Time timestamp={dateStart} format="MM/YYYY" icon={false} />
          {#if dateEnd && !currentPosition}
            &mdash; <Time timestamp={dateEnd} format="MM/YYYY" icon={false} />
          {/if}

          {#if currentPosition}
            &mdash; <Time text={"Present"} icon={false} />
          {/if}
        </div>

        {#if location}
          / <PlainText className={"font-mono text-sm"} text={location} />
        {/if}

        {#if company && companyUrl}
          / <a class={slotLink()} title={company} href={companyUrl}>{companyUrl}</a>
        {/if}
      </div>
    </div>
  </div>
{/if}
