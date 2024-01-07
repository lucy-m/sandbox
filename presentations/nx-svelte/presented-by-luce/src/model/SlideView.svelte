<script lang="ts">
  import { SlideObjectInternal, getStyleString } from './slide-object';

  export let slideObjects: SlideObjectInternal[];
</script>

<svg width="800" height="600" style="border: 1px solid black">
  {#each slideObjects as slideObject (slideObject.id)}
    <rect
      x={slideObject.position.x}
      y={slideObject.position.y}
      width="80"
      height="80"
      fill={slideObject.color}
      style={getStyleString(slideObject)}
    />
  {/each}
</svg>
