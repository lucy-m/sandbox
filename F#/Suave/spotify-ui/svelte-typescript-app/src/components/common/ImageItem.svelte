<script lang="ts">
  import type { ImageModel } from '../../models';
  import Images from './Images.svelte';

  export let images: ImageModel[];
</script>

<div class="wrapper">
  <Images {images} />
  <div class="text-wrapper">
    <slot />
  </div>
  {#if $$slots.action}
    <div class="action-wrapper">
      <slot name="action" />
    </div>
  {/if}
</div>

<style>
  .wrapper {
    display: flex;
    column-gap: 1rem;
    justify-content: center;
    background-image: linear-gradient(
      65deg,
      hsl(275deg, 22%, 81%),
      hsl(275deg, 27%, 57%)
    );
    padding: 0.75rem;
    border-radius: 4px;
  }

  .text-wrapper {
    flex-grow: 1;
  }

  .action-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>
