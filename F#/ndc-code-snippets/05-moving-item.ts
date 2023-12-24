import fc from "fast-check";

interface MovingItem {
  position: [number, number];
  velocity: [number, number];
  properties: {
    friction: number;
    weight: number;
  };
}

const movingItemArb: fc.Arbitrary<MovingItem> = fc.record({
  position: fc.tuple(fc.double(), fc.double()),
  velocity: fc.tuple(fc.double(), fc.double()),
  properties: fc.record({
    friction: fc.double(),
    weight: fc.double(),
  }),
});

fc.sample(movingItemArb);

console.log("Hello world");
