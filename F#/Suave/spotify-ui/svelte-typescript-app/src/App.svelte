<script lang="ts">
  import Toast from './components/common/Toast.svelte';
  import NamedSections from './components/NamedSections.svelte';
  import NamePicker from './components/NamePicker/NamePicker.svelte';
  import { localStorageService } from './services';

  let name: string | undefined = localStorageService.getName();

  const onNameChosen = (s: string) => {
    localStorageService.setName(s);
    name = s;
  };
</script>

<main>
  <h1>My best spotify app</h1>
  {#if name}
    <NamedSections {name} />
  {:else}
    <NamePicker {onNameChosen} />
  {/if}
  <Toast />
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
