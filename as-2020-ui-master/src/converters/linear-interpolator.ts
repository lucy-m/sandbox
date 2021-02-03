import { TimePositionConverter, Position, Time } from './model';
import { Point } from './point';

/**
 * Linear interpolates time to position between two points
 * @param start Position at t=0
 * @param end Position at t=1
 */
export const LinearInterpolator = (
  start: Point,
  end: Point
): TimePositionConverter => {
  const linearInterpolate = (a: number, b: number, time: number): number => {
    if (time >= 1) {
      return b;
    }
    if (time <= 0) {
      return a;
    }
    return time * (b - a) + a;
  };
  const convert = (time: Time): Position => {
    const x = linearInterpolate(start.x, end.x, time.time);
    const y = linearInterpolate(start.y, end.y, time.time);
    return { position: { x, y } };
  };

  return { convert };
};
