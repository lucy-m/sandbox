import { Sharp, VertexShape } from '../../shapes';

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

export const mediaPlayer = {
  play,
  pauseLeft,
  pauseRight,
};
