export interface Point {
  x: number;
  y: number;
}

export const addPoint = (p1: Point, p2: Point): Point => ({
  x: p1.x + p2.x,
  y: p1.y + p2.y,
});

export const scale = (p: Point, scale: number): Point => ({
  x: p.x * scale,
  y: p.y * scale,
});
