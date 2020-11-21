import { Zero } from '../../shapes';
import {
  Sharp,
  Smooth,
  SmoothAsymm,
  VertexShape,
} from '../../shapes/vertex-bezier';

const A = {
  start: Sharp({ x: 100, y: 300 }),
  subsequent: [
    Sharp({ x: 140, y: 200 }),
    Sharp({ x: 160, y: 250 }),
    SmoothAsymm({ x: 125, y: 250 }, Zero, { x: 40, y: 0 }),
    SmoothAsymm({ x: 180, y: 300 }, { x: -15, y: -48 }, Zero),
  ],
};

const B: VertexShape = {
  start: Sharp({ x: 100, y: 300 }),
  subsequent: [
    Sharp({ x: 100, y: 250 }),
    SmoothAsymm({ x: 100, y: 200 }, Zero, { x: 50, y: 0 }),
    SmoothAsymm({ x: 105, y: 240 }, { x: 50, y: 0 }, { x: 60, y: 0 }),
    SmoothAsymm({ x: 105, y: 300 }, { x: 60, y: 0 }, Zero),
  ],
};

const C: VertexShape = {
  start: SmoothAsymm({ x: 164, y: 228 }, Zero, { x: -20, y: -14 }),
  subsequent: [
    Smooth({ x: 120, y: 240 }, { x: 6, y: -15 }),
    Smooth({ x: 114, y: 270 }, { x: 0, y: -10 }),
    Smooth({ x: 120, y: 300 }, { x: -6, y: -15 }),
    SmoothAsymm({ x: 164, y: 312 }, { x: -20, y: 14 }, Zero),
  ],
};

export const letters = {
  A,
  B,
  C,
};
