<script lang="ts">
  import { PlaylistModel } from '../models';
  import Playlist from './Playlist.svelte';

  const fetchData: Promise<PlaylistModel[]> = (async () => {
    const response = await fetch('http://localhost:8080/playlists');
    return await response.json();
  })();
</script>

<div class="items-wrapper">
  {#await fetchData}
    <p>Fetching playlists</p>
  {:then data}
    {#each data as playlist}
      <Playlist {playlist} />
    {/each}
  {:catch error}
    <p>An error occurred {error}</p>
  {/await}
</div>

<style>
  .items-wrapper {
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
  }
</style>
