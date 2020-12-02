export interface Shape<T> {
  start: T;
  subsequent: T[];
}

export const getPoints = <T>(shape: Shape<T>): T[] => [
  shape.start,
  ...shape.subsequent,
];
