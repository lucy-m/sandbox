<script lang="ts">
  import { readable } from 'svelte/store';
  import type { TrackedTrackModel } from '../../models/trackedTrack';
  import { apiService } from '../../services/api';
  import { subscriberStore } from '../../utils/subscriberStore';
  import Stack from '../common/Stack.svelte';
  import Track from '../common/Track.svelte';

  const tracks = subscriberStore(apiService.getTracks());

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
  {#if $tracks.kind === 'initial'}
    <p>Fetching tracks</p>
  {:else if $tracks.kind === 'data'}
    <Stack>
      {#each $tracks.data as track}
        <Track track={track.track}>
          <p slot="additional-text">
            Added by {track.info?.addedBy ?? 'Unknown'}
          </p>
          <button slot="action"> Click! </button>
        </Track>
      {/each}
    </Stack>
  {:else if $tracks.kind === 'error'}
    <p>Couldn't load tracks 😔</p>
  {/if}
</div>
