export interface Point {
  x: number;
  y: number;
}

export const addPoint = (...points: Point[]): Point => {
  return points.reduce((prev, next) => ({
    x: prev.x + next.x,
    y: prev.y + next.y
  }));
};
