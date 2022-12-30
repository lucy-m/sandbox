<script lang="ts">
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
  <p>{JSON.stringify(searchResults.data)}</p>
{/if}
