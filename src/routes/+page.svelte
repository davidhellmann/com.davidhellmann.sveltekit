<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
  const entries = data.entries;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<div>
  {#if entries}
    {#each entries as entry (entry.id)}
      {#if entry?.__typename === "entryBlogDetail_Entry"}
        <li>
          <a href={entry.url}>
            <h2>{entry.title}</h2>
            {#if entry.description}
              {entry.description}
            {/if}
          </a>
        </li>
      {/if}
    {/each}
  {/if}
</div>
