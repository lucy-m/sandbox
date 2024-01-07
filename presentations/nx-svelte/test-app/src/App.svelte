<script lang="ts">
  import {
    PosFns,
    SlideObject,
    SlideView,
    makeSlideObject,
    morphSlideObject,
  } from 'presented-by-luce';
  import seedrandom from 'seedrandom';
  import { writable } from 'svelte/store';

  const prng = seedrandom(Math.random().toString());

  const makeSlideObjectBound = makeSlideObject(prng);

  const initialSlideObjects: SlideObject[] = [
    makeSlideObjectBound({ position: PosFns.new(20, 100), color: 'darkred' }),
    makeSlideObjectBound({ position: PosFns.new(150, 50), color: 'lightblue' }),
  ];

  const secondSlideObjects: SlideObject[] = [
    morphSlideObject(initialSlideObjects[0], {
      position: PosFns.new(220, 120),
      color: 'darkred',
    }),
    morphSlideObject(initialSlideObjects[1], {
      position: PosFns.new(110, 30),
      color: 'lightblue',
    }),
  ];

  const slideObjects = writable<SlideObject[]>(initialSlideObjects);
</script>

<main>
  <button
    on:click={() => {
      slideObjects.set(secondSlideObjects);
    }}>Next</button
  >

  <SlideView slideObjects={$slideObjects} />
</main>
