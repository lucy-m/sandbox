<script lang="ts">
  import { ImageModel } from '../models';

  export let images: ImageModel[];

  $: firstImage = images[0];
</script>

{#if firstImage}
  <img src={firstImage?.url} alt="Playlist" />
{:else}
  <div class="placeholder">?</div>
{/if}

<style>
  img,
  .placeholder {
    height: 80px;
    flex: 0 0 80px;
  }

  .placeholder {
    background-color: hsl(220deg, 14%, 63%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: hsl(220deg, 36%, 97%);
  }
</style>
