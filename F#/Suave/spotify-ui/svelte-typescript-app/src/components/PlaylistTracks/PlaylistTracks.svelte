<script lang="ts">
  import { useApiService } from '../../utils/contexts';
  import { subscriberStore } from '../../utils/subscriberStore';
  import Stack from '../common/Stack.svelte';
  import Track from '../common/Track.svelte';

  const apiService = useApiService();
  const tracks = subscriberStore(apiService.getTracks());
</script>

<div>
  <h2>Playlist tracks</h2>
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
