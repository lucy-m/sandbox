import { Sharp, SmoothAsymm, VertexShape } from '../../shapes';

const org: VertexShape[] = [
  {
    start: Sharp({ x: 1.0, y: 111.92 }),
    subsequent: [
      Sharp({ x: 49.0, y: 109.46 }),
      SmoothAsymm(
        { x: 19.54, y: 90.0 },
        { x: 12.65, y: 22.19 },
        { x: -55.29, y: 68.7 }
      ),
      SmoothAsymm(
        { x: 63.35, y: 1.16 },
        { x: -47.09, y: 3.69 },
        { x: 37.17, y: -2.91 }
      ),
      SmoothAsymm(
        { x: 79.41, y: 47.91 },
        { x: 21.3, y: -12.43 },
        { x: 34.1, y: 0.97 }
      ),
      Sharp({ x: 20.12, y: 61.64 }),
    ],
  },
  {
    start: Sharp({ x: 83.0, y: 96.6 }),
    subsequent: [
      SmoothAsymm(
        { x: 69.0, y: 105.03 },
        { x: 6.55, y: -2.67 },
        { x: -5.15, y: 2.1 }
      ),
      Sharp({ x: 52.8, y: 109.46 }),
      Sharp({ x: 109.26, y: 111.92 }),
    ],
  },
];

const fixed: VertexShape[] = [
  {
    start: Sharp({ x: 1.0, y: 111.92 }),
    subsequent: [
      Sharp({ x: 49.0, y: 109.46 }),
      SmoothAsymm(
        { x: 19.54, y: 90.0 },
        { x: 12.65, y: 22.19 },
        { x: -11.48, y: -20.14 }
      ),
      SmoothAsymm(
        { x: 63.35, y: 1.16 },
        { x: -47.09, y: 3.69 },
        { x: 37.17, y: -2.91 }
      ),
      SmoothAsymm(
        { x: 79.41, y: 47.91 },
        { x: 21.3, y: -12.43 },
        { x: -25.21, y: 14.7 }
      ),
      Sharp({ x: 20.12, y: 61.64 }),
    ],
  },
  {
    start: Sharp({ x: 83.0, y: 96.6 }),
    subsequent: [
      SmoothAsymm(
        { x: 69.0, y: 105.03 },
        { x: 6.55, y: -2.67 },
        { x: -5.15, y: 2.1 }
      ),
      Sharp({ x: 52.8, y: 109.46 }),
      Sharp({ x: 109.26, y: 111.92 }),
    ],
  },
];

export const testPaths = {
  org,
  fixed,
};
