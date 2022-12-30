<script lang="ts">
  import type { TrackModel } from '../../models/track';
  import Images from './Images.svelte';
 
  export let track: TrackModel;

  $: artists = track.artists.map((a) => a.name).join(', ');
</script>

<div class="track-wrapper">
  <Images images={track.album.images} />
  <div class="track-text-wrapper">
    <h2>{track.name}</h2>
    <p>{artists}</p>
  </div>
</div>

<style>
  .track-wrapper {
    display: flex;
    column-gap: 1rem;
    background-image: linear-gradient(
      65deg,
      hsl(275deg, 22%, 81%),
      hsl(275deg, 27%, 57%)
    );
    padding: 0.75rem;
    border-radius: 4px;
  }

  .track-text-wrapper {
    flex-grow: 1;
  }
</style>
