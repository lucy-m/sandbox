import { Point } from './point';

export interface Time {
  time: number;
}

export interface Position {
  position: Point;
}

export const distanceBetween = (
  { position: a }: Position,
  { position: b }: Position
): number => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

export const positionsClose = (a: Position, b: Position) => {
  const distance = distanceBetween(a, b);
  return distance < 0.1;
};

export interface TimeConverter {
  convert: (val: Time) => Time;
}

export interface PositionConverter {
  convert: (val: Position) => Position;
}

export interface TimePositionConverter {
  convert: (val: Time) => Position;
}
