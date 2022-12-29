<script lang="ts">
  import TestComponent from './components/TestComponent.svelte';

  export let name: string;
</script>

<main>
  <h1>Hello {name}!</h1>
  <TestComponent />
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
