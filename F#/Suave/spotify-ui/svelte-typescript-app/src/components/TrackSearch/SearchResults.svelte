<script lang="ts">
  import Track from '../common/Track.svelte';
  import type { StoreState } from './stores';

  export let searchResults: StoreState;
</script>

{#if searchResults.kind === 'initial'}
  <p>Type in the box to search!</p>
{:else if searchResults.kind === 'loading'}
  <p>Loading...</p>
{:else if searchResults.kind === 'error'}
  <p>There was an error: {searchResults.message}</p>
{:else}
  <div class="items-wrapper">
    {#each searchResults.data as track}
      <Track {track} />
    {/each}
  </div>
{/if}

<style>
  .items-wrapper {
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
  }
</style>
