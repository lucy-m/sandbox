export interface Point {
  x: number;
  y: number;
}

const cleanseNegativeZero = (p: Point): Point => ({
  x: p.x === -0 ? 0 : p.x,
  y: p.y === -0 ? 0 : p.y,
});

export const p = (x: number, y: number) =>
  cleanseNegativeZero({
    x,
    y,
  });

export const Zero: Point = { x: 0, y: 0 };

export const addPoint = (p1: Point, p2: Point): Point => ({
  x: p1.x + p2.x,
  y: p1.y + p2.y,
});

export const scale = (p: Point, scale: number): Point =>
  cleanseNegativeZero({
    x: p.x * scale,
    y: p.y * scale,
  });

export const dist = (p1: Point, p2: Point): number =>
  Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
