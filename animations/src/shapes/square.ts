import { addPoint, p, Point, Sharp, VertexShape } from '.';

export const makeSquare = (origin: Point, size: number): VertexShape => ({
  start: Sharp(origin),
  subsequent: [
    Sharp(addPoint(origin, p(size, 0))),
    Sharp(addPoint(origin, p(size, size))),
    Sharp(addPoint(origin, p(0, size))),
  ],
});
