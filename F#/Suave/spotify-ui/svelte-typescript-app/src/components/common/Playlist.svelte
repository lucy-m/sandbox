<script lang="ts">
  import type { PlaylistModel } from '../../models';
  import Images from './Images.svelte';

  export let playlist: PlaylistModel;
</script>

<div class="playlist-wrapper">
  <Images images={playlist.images} />
  <div class="playlist-text-wrapper">
    <h2>{playlist.name}</h2>
    <p>{playlist.id}</p>
  </div>
</div>

<style>
  .playlist-wrapper {
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

  .playlist-text-wrapper {
    flex-grow: 1;
  }
</style>
