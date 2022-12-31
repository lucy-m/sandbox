<script lang="ts">
  import { apiService } from '../../services/api';
  import Stack from '../common/Stack.svelte';
  import Track from '../common/Track.svelte';

  const tracks = apiService.getTracks();

  const uris = [
    'spotify:track:30nxyjRmkxXJSs5CLiUZQt',
    'spotify:track:0gchQwxmBWj5no8NJ8b2yH',
    'spotify:track:0XHqKfHasV3bs5RHaVC50O',
  ];

  const addSong = (uri: string) => apiService.addTrack('Ash', uri);
</script>

<div>
  <div>
    <p>Add songs!</p>
    {#each uris as uri}
      <button on:click={() => addSong(uri)}>
        {uri}
      </button>
    {/each}
  </div>
  {#await tracks}
    <p>Fetching tracks</p>
  {:then data}
    <Stack>
      {#each data as track}
        <Track track={track.track}>
          <p slot="additional-text">
            Added by {track.info?.addedBy ?? 'Unknown'}
          </p>
          <button slot="action"> Click! </button>
        </Track>
      {/each}
    </Stack>
  {:catch error}
    <p>An error occurred {error}</p>
  {/await}
</div>
