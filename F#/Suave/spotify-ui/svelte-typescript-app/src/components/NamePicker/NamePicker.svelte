<script lang="ts">
  export let onNameChosen: (s: string) => void;

  let name: string;
  $: validName = !!(name && name.trim());

  const onOk = () => {
    if (validName) {
      onNameChosen(name);
    }
  };

  const onKeydown = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      onOk();
    }
  };
</script>

<h2>Please pick your user name</h2>
<input bind:value={name} on:keydown={onKeydown} />
<button on:click={onOk} disabled={!validName}>OK</button>
