<script lang="ts">
  import type { TrackModel } from '../../models/track';
  import ImageItem from './ImageItem.svelte';

  export let track: TrackModel;

  $: artists = track.artists.map((a) => a.name).join(', ');
</script>

<ImageItem images={track.album.images}>
  <h2>{track.name}</h2>
  <p>{artists}</p>
  <slot name="additional-text" />
  <slot slot="action" name="action" />
</ImageItem>
