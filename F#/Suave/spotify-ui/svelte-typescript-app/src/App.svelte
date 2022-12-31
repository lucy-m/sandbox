<script lang="ts">
  import TrackedTest from './components/TrackedTest/TrackedTest.svelte';
  import TrackSearch from './components/TrackSearch/TrackSearch.svelte';
</script>

<main>
  <h1>My best spotify app</h1>
  <TrackedTest />
  <TrackSearch />
</main>

<style>
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  :global(p, h1, h2) {
    margin: 0;
  }
</style>
