<script lang="ts">
  import type { PageData } from "./$types";
  import RichText from "$components/text/RichText.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  const entries = data.entries;
  const cc = {
    grid: "w-full max-w-7xl grid grid-cols-1 gap-4 lg:grid-cols-6 lg:grid-rows-2 mx-auto my-72",
    card2Cols: "relative lg:col-span-3 [&_h2]:text-5xl [&_h2]:font-bold flex",
    card3Cols: "relative lg:col-span-2 [&_h2]:text-3xl [&_h2]:font-bold flex",
    card1: "absolute inset-px rounded-lg max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]",
    card2: "absolute inset-px rounded-lg lg:rounded-tr-[2rem]",
    card3: "absolute inset-px rounded-lg lg:rounded-bl-[2rem]",
    card4: "absolute inset-px rounded-lg",
    card5: "absolute inset-px rounded-lg max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]",
    glassEffect: "isolate bg-white/50 backdrop-blur-3xl shadow-md ring-1 ring-black/5",
    cardContent: "relative text-black py-16 px-12 space-y-4 h-full flex flex-col overflow-clip",
    heading: "text-primary-800"
  };

  const getCardClass = (index: number) => {
    return [
      cc.card1,
      cc.card2,
      cc.card3,
      cc.card4,
      cc.card5
    ][index] || cc.card1;
  };
</script>

<div class={cc.grid}>
  {#if entries}
    {#each entries as entry, index}
      {#if entry?.__typename === "entryBlogDetail_Entry"}
        <a href={entry?.url} class={`${index < 2 ? cc.card2Cols : cc.card3Cols}`}>
          <div class={`${getCardClass(index)} ${cc.glassEffect}`}></div>
          <div class={cc.cardContent}>

            <!--{#if entry?.image[0]}-->
            <!--  <img src={entry.image[0].url} class="-mt-24 max-w-none w-full -mx-12 aspect-video object-cover" alt="">-->
            <!--{/if}-->
            <h2 class={cc.heading}>{entry.title}</h2>
            {#if entry?.description}
              <RichText html={entry.description} className="text-lg line-clamp-3"/>
            {/if}
          </div>
        </a>
      {/if}
    {/each}
  {/if}
</div>
