import { Shape, Spring } from '.';
import { Sharp, VertexShape } from './VertexBezier';

export type SpringShape = Shape<Spring>;

export const toVertexShape = (shape: SpringShape): VertexShape => {
  const start = Sharp(shape.start.position);
  const subsequent = shape.subsequent.map((s) => Sharp(s.position));

  return { start, subsequent };
};
