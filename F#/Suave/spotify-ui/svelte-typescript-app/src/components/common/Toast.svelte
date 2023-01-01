<script lang="ts">
  import { closeToast, raiseToast, toastStore } from './toastStore';

  const toast = toastStore();

  raiseToast('test toast');
</script>

<div class={`toast ${$toast.kind === 'data' ? $toast.data.direction : 'out'}`}>
  <p>{$toast.kind === 'data' ? $toast.data.message : ''}</p>
  <button on:click={closeToast}>X</button>
</div>

<style>
  .toast {
    position: fixed;
    right: 1rem;
    left: 1rem;
    padding: 1rem;
    bottom: 0;
    background-color: hsl(188deg, 35%, 85%);
    border-radius: 4px 4px 0 0;
    box-shadow: 6px 6px 8px 1px hsla(0deg, 0%, 0%, 0.14);

    display: flex;

    transition: transform 300ms;
  }

  p {
    flex-grow: 1;
  }

  .out {
    transform: translateY(100%);
  }
</style>
