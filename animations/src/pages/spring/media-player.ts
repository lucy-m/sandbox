import {
  p,
  Sharp,
  SmoothAsymm,
  squishTo,
  translateShape,
  VertexShape,
} from '../../shapes';

const play: VertexShape = {
  start: Sharp({ x: 0, y: 0 }),
  subsequent: [
    Sharp({ x: 0, y: -100 }),
    Sharp({ x: 100, y: -50 }),
    Sharp({ x: 0, y: 0 }),
  ],
};

const pauseLeft: VertexShape = {
  start: Sharp({ x: 0, y: 0 }),
  subsequent: [
    Sharp({ x: 0, y: -100 }),
    Sharp({ x: 30, y: -100 }),
    Sharp({ x: 30, y: 0 }),
    Sharp({ x: 0, y: 0 }),
  ],
};

const pauseRight: VertexShape = {
  start: Sharp({ x: 60, y: 0 }),
  subsequent: [
    Sharp({ x: 60, y: -100 }),
    Sharp({ x: 90, y: -100 }),
    Sharp({ x: 90, y: 0 }),
    Sharp({ x: 60, y: 0 }),
  ],
};

const e1: VertexShape = translateShape(
  {
    start: Sharp({ x: 1.0, y: 109.5 }),
    subsequent: [
      Sharp({ x: 49.0, y: 109.5 }),
      SmoothAsymm(
        { x: 19.5, y: 90.0 },
        { x: 12.7, y: 22.2 },
        { x: -11.4, y: -20.1 }
      ),
      SmoothAsymm(
        { x: 63.3, y: 1.2 },
        { x: -47.0, y: 3.6 },
        { x: 37.2, y: -2.9 }
      ),
      SmoothAsymm(
        { x: 79.4, y: 48.0 },
        { x: 21.3, y: -12.5 },
        { x: -25.2, y: 14.6 }
      ),
      Sharp({ x: 20.1, y: 61.6 }),
    ],
  },
  p(0, -109.5)
);

const e2: VertexShape = translateShape(
  {
    start: Sharp({ x: 83.0, y: 96.6 }),
    subsequent: [
      SmoothAsymm(
        { x: 69.0, y: 105.0 },
        { x: 6.6, y: -2.6 },
        { x: -5.2, y: 2.1 }
      ),
      Sharp({ x: 52.8, y: 109.4 }),
      Sharp({ x: 109.3, y: 109.4 }),
    ],
  },
  p(0, -109.5)
);

const eFlat1 = squishTo(0, e1);
const eFlat2 = squishTo(0, e2);

export const mediaPlayer = {
  play,
  pauseLeft,
  pauseRight,
  e1,
  e2,
  eFlat1,
  eFlat2,
};
