import { Point } from './point';

export interface Shape<T> {
  start: T;
  subsequent: T[];
  origin?: Point;
  closed?: boolean;
}

const getPoints = <T>(shape: Shape<T>): T[] => [
  shape.start,
  ...shape.subsequent,
];

const map = <T, U>(shape: Shape<T>, mapFn: (t: T) => U): Shape<U> => ({
  start: mapFn(shape.start),
  subsequent: shape.subsequent.map(mapFn),
});

export const ShapeFn = {
  getPoints,
  map,
};
