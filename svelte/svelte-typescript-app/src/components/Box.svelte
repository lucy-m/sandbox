<script lang="ts">
  let value: number = 0;

  // doubled is recalculated when value changes
  $: doubled = value * 2;

  $: tripled = (() => {
    const multiplier = 3;
    return value * multiplier;
  })();

  const onClick = () => {
    value += 1;
  };
</script>

<div class="box" on:click={onClick}>
  <div>
    The value is {value}
  </div>
  <div>Doubled is {doubled}</div>
  <div>Tripled is {tripled}</div>
</div>

<style>
  .box {
    padding: 2rem;
    background-color: mediumslateblue;
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
    user-select: none;
  }
</style>
