<script lang="ts">
  import type { TrackedTrackModel } from '../../models/trackedTrack';
  import { useApiService, useUserName } from '../../utils/contexts';
  import { subscriberStore } from '../../utils/subscriberStore';
  import Stack from '../common/Stack.svelte';
  import Track from '../common/Track.svelte';

  const apiService = useApiService();
  const tracks = subscriberStore(apiService.getTracks());
  const userName = useUserName();

  const canDelete = (t: TrackedTrackModel): boolean => {
    if (t.info?.addedBy && userName) {
      return t.info.addedBy === userName;
    } else {
      return false;
    }
  };

  const onDelete = (t: TrackedTrackModel) => {
    if (canDelete(t)) {
      apiService.deleteTrack(t.track.uri);
    }
  };
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
          <button
            slot="action"
            disabled={!canDelete(track)}
            on:click={() => onDelete(track)}
          >
            Delete
          </button>
        </Track>
      {/each}
    </Stack>
  {:else if $tracks.kind === 'error'}
    <p>Couldn't load tracks 😔</p>
  {/if}
</div>
