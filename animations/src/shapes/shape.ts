export interface Shape<T> {
  start: T;
  subsequent: T[];
}

export const getPoints = <T>(shape: Shape<T>): T[] => [
  shape.start,
  ...shape.subsequent,
];

export const map = <T, U>(shape: Shape<T>, mapFn: (t: T) => U): Shape<U> => ({
  start: mapFn(shape.start),
  subsequent: shape.subsequent.map(mapFn),
});
