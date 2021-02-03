import inside from 'point-in-polygon';
import { Point } from '../converters/point';

export const pointInPolygon = (
  point: Point,
  polygon: Array<Point>
): boolean => {
  const pointArray = [point.x, point.y];
  const polygonArray = polygon.map(p => [p.x, p.y]);

  return inside(pointArray, polygonArray);
};

export default pointInPolygon;
