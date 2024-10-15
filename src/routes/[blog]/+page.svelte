<script lang="ts">
  import type { PageData } from "./$types";
  import davidhellmann from "$images/davidhellmann-dark2.jpg";
  import RichText from "$lib/components/text/RichText.svelte";

  export let data: PageData;
  const entries = data.entries;
  const cc = {
    grid: "w-full max-w-7xl grid grid-cols-1 gap-4 lg:grid-cols-6 lg:grid-rows-2 mx-auto my-72",
    card2Cols: "relative lg:col-span-3 [&_h2]:text-7xl [&_h2]:font-bold flex",
    card3Cols: "relative lg:col-span-2 [&_h2]:text-5xl [&_h2]:font-bold flex",
    card1: "absolute inset-px rounded-lg max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]",
    card2: "absolute inset-px rounded-lg lg:rounded-tr-[2rem]",
    card3: "absolute inset-px rounded-lg lg:rounded-bl-[2rem]",
    card4: "absolute inset-px rounded-lg",
    card5: "absolute inset-px rounded-lg max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]",
    glassEffect: "isolate bg-black/20 backdrop-blur-xl shadow-md ring-1 ring-black/5",
    cardContent: "relative text-white py-16 px-12 space-y-4 h-full flex flex-col overflow-clip",
    heading: "bg-gradient-to-r from-accent-pink-500 to-primary-700 inline-block text-transparent bg-clip-text"
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

<!--{#if davidhellmann}-->
<!--  <img alt="David Hellmann" class="fixed inset-0 w-screen h-screen object-cover object-top" src={davidhellmann} />-->
<!--{/if}-->

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
