<script lang="ts">
  import type { PageData } from "./$types";
  // import davidhellmann from "$images/davidhellmann-dark2.jpg";
  // import RichText from "$lib/components/text/RichText.svelte";
  import Pagination from "$lib/components/navigation/Pagination.svelte";
  import MediaWrapper from "$lib/components/wrapper/MediaWrapper.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  const entryCount = data.entryCount ?? 1;
  let entries = $state(data.entries);
  let limit = $state(10);
  let page = $state(1);


  $effect(() => {
    entries = data.entries;
    limit = data.limit;
    page = data.page;
  });

  const cc = {
    list: "bg-red-200 text-2xl",
  };
</script>

<!--{#if davidhellmann}-->
<!--  <img alt="David Hellmann" class="fixed inset-0 w-screen h-screen object-cover object-top" src={davidhellmann} />-->
<!--{/if}-->

<MediaWrapper className={"sticky top-0 p-4 w-auto"}>
  <Pagination totalItems={entryCount} limit={limit} currentPage={page} />
</MediaWrapper>
<ul class={cc.list}>
  {#if entries}
    {#each entries as entry (entry.id)}
      {#if entry?.__typename === "entryBlogDetail_Entry"}
        <li>
          <a href={entry.url}>
            <h2>{entry.title}</h2>
            <h2>{entry.title}</h2>
            <h2>{entry.title}</h2>
            <h2>{entry.title}</h2>
            <h2>{entry.title}</h2>
            <h2>{entry.title}</h2>
            <h2>{entry.title}</h2>
            <h2>{entry.title}</h2>
            <h2>{entry.title}</h2>
            <h2>{entry.title}</h2>
            <h2>{entry.title}</h2>
            <h2>{entry.title}</h2>
            <h2>{entry.title}</h2>
            {#if entry.description}
              {entry.description}
            {/if}
          </a>
        </li>
      {/if}
    {/each}
  {/if}
</ul>
