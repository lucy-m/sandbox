import { Point, Sharp, VertexShape } from '../../shapes';

export interface SpringBoneShape {
  start: Point;
  subsequent: Point[];
}

export const toVertexShape = (shape: SpringBoneShape): VertexShape => {
  const start = Sharp(shape.start);
  const subsequent = shape.subsequent.map(Sharp);

  return { start, subsequent };
};
