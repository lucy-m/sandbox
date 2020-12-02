import { Zero } from '../../shapes';
import {
  Sharp,
  Smooth,
  SmoothAsymm,
  VertexShape,
} from '../../shapes/vertex-bezier';

const A = {
  start: Sharp({ x: 0, y: 0 }),
  subsequent: [
    Sharp({ x: 40, y: -100 }),
    Sharp({ x: 60, y: -50 }),
    SmoothAsymm({ x: 25, y: -50 }, Zero, { x: 40, y: 0 }),
    SmoothAsymm({ x: 80, y: 0 }, { x: -15, y: -48 }, Zero),
  ],
};

const B: VertexShape = {
  start: Sharp({ x: 0, y: 0 }),
  subsequent: [
    SmoothAsymm({ x: 0, y: -100 }, Zero, { x: 50, y: 0 }),
    SmoothAsymm({ x: 5, y: -60 }, { x: 50, y: 0 }, { x: 60, y: 0 }),
    SmoothAsymm({ x: 5, y: 0 }, { x: 60, y: 0 }, Zero),
  ],
};

const C: VertexShape = {
  start: SmoothAsymm({ x: 54, y: -15 }, Zero, { x: -14, y: 14 }),
  subsequent: [
    Smooth({ x: 9, y: -19 }, { x: 7, y: 12 }),
    Smooth({ x: 0, y: -49 }, { x: 0, y: 8 }),
    Smooth({ x: 9, y: -79 }, { x: -7, y: 12 }),
    SmoothAsymm({ x: 54, y: -83 }, { x: -14, y: -14 }, Zero),
  ],
};

const D: VertexShape = {
  start: Sharp({ x: 0, y: 0 }),
  subsequent: [
    SmoothAsymm({ x: 0, y: -100 }, Zero, { x: 40, y: 0 }),
    Smooth({ x: 50, y: -50 }, { x: 0, y: -30 }),
    SmoothAsymm({ x: 5, y: 0 }, { x: 35, y: 0 }, Zero),
  ],
};

const E: VertexShape = {
  start: Sharp({ x: 50, y: 0 }),
  subsequent: [
    SmoothAsymm({ x: 0, y: 0 }, Zero, { x: 0, y: -50 }),
    SmoothAsymm({ x: 30, y: -50 }, { x: -30, y: 0 }, { x: -30, y: 0 }),
    SmoothAsymm({ x: 0, y: -100 }, { x: 0, y: 50 }, Zero),
    Sharp({ x: 50, y: -100 }),
  ],
};

const F: VertexShape = {
  start: SmoothAsymm({ x: 0, y: 0 }, Zero, { x: 0, y: -50 }),
  subsequent: [
    SmoothAsymm({ x: 30, y: -50 }, { x: -30, y: 0 }, { x: -30, y: 0 }),
    SmoothAsymm({ x: 0, y: -100 }, { x: 0, y: 50 }, Zero),
    Sharp({ x: 50, y: -100 }),
  ],
};

const I: VertexShape = {
  start: Sharp({ x: 0, y: 0 }),
  subsequent: [Sharp({ x: 0, y: -50 }), Sharp({ x: 0, y: -100 })],
};

export const letters = {
  A,
  B,
  C,
  D,
  E,
  F,
  I,
};
