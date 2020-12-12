import { Attempt, makeFailure, makeSuccess } from 'luce-util';
import React from 'react';
import { Shape } from '.';
import { addPoint, Point, scale, Zero } from './point';
import { ClosePath, CurveRel, SvgPathCommand } from './svg-path-commands';
import { DrawingConfig, SvgPath } from './SvgPath';

export interface Vertex {
  position: Point;
  outGrad: Point;
  inGrad: Point;
  draw: (next: Vertex) => SvgPathCommand;
}

export type VertexShape = Shape<Vertex>;

export const verticesToShape = (
  vertices: Vertex[],
  closed: boolean
): Attempt<VertexShape> => {
  const start = vertices[0];
  if (start) {
    const subsequent = vertices.slice(1);
    return makeSuccess({ start, subsequent, closed });
  } else {
    return makeFailure(['Cannot create empty shape']);
  }
};

export const SmoothAsymm = (
  position: Point,
  inGrad: Point,
  outGrad: Point
): Vertex => {
  const draw = (next: Vertex): SvgPathCommand => {
    const dp = addPoint(next.position, scale(position, -1));
    const startControlRel = outGrad;
    const endControlRel = next.inGrad;

    return CurveRel(dp, startControlRel, endControlRel);
  };

  return {
    position,
    inGrad,
    outGrad,
    draw,
  };
};

export const Smooth = (position: Point, gradient: Point): Vertex =>
  SmoothAsymm(position, gradient, scale(gradient, -1));

export const Sharp = (position: Point): Vertex =>
  Smooth(position, { x: 0, y: 0 });

export const translate = (vertex: Vertex, origin: Point): Vertex => {
  return SmoothAsymm(
    addPoint(vertex.position, origin),
    vertex.inGrad,
    vertex.outGrad
  );
};

export const translateShape = (
  shape: VertexShape,
  origin: Point
): VertexShape => {
  const start = translate(shape.start, origin);
  const subsequent = shape.subsequent.map((v) => translate(v, origin));

  return { start, subsequent };
};

interface VertexBezierProps {
  shape: VertexShape;
  origin?: Point;
  drawingConfig?: DrawingConfig;
}

export const VertexBezier: React.FC<VertexBezierProps> = (props) => {
  const origin = props.origin ?? Zero;
  const shape = translateShape(props.shape, origin);

  const start = shape.start.position;
  const allPoints = [shape.start, ...shape.subsequent];
  const commands = allPoints
    .slice(1)
    .reduce<Array<SvgPathCommand>>((acc, next, i) => {
      const prev = allPoints[i];
      const command = prev.draw(next);
      return [...acc, command];
    }, [])
    .concat(props.shape.closed ? ClosePath() : []);

  return (
    <SvgPath
      start={start}
      commands={commands}
      drawingConfig={props.drawingConfig}
    ></SvgPath>
  );
};
