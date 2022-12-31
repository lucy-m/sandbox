<script lang="ts">
  import Stack from '../common/Stack.svelte';
  import Track from '../common/Track.svelte';
  import type { StoreState } from './stores';

  export let searchResults: StoreState;
  export let onAdd: (uri: string) => void;
</script>

{#if searchResults.kind === 'initial'}
  <p>Type in the box to search!</p>
{:else if searchResults.kind === 'loading'}
  <p>Loading...</p>
{:else if searchResults.kind === 'error'}
  <p>There was an error: {searchResults.message}</p>
{:else}
  <Stack>
    {#each searchResults.data as track}
      <Track {track}>
        <button slot="action" on:click={() => onAdd(track.uri)}>Add</button>
      </Track>
    {/each}
  </Stack>
{/if}
