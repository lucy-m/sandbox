<script lang="ts">
  import type { PlaylistModel } from '../models';
  import Playlist from './common/Playlist.svelte';
  import Stack from './common/Stack.svelte';

  const fetchData: Promise<PlaylistModel[]> = (async () => {
    const response = await fetch('http://localhost:8080/playlists');
    return await response.json();
  })();
</script>

<Stack>
  {#await fetchData}
    <p>Fetching playlists</p>
  {:then data}
    {#each data as playlist}
      <Playlist {playlist} />
    {/each}
  {:catch error}
    <p>An error occurred {error}</p>
  {/await}
</Stack>
