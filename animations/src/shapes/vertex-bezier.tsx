import React from 'react';
import { addPoint, Point, scale } from './point';
import { SvgPath } from './svg-path';
import { CurveRel, SvgPathCommand } from './svg-path-commands';

export interface Vertex {
  position: Point;
  outGrad: Point;
  inGrad: Point;
  draw: (next: Vertex) => SvgPathCommand;
}

export interface VertexShape {
  start: Vertex;
  subsequent: Vertex[];
}

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

interface VertexBezierProps {
  shape: VertexShape;
  showMarkers?: boolean;
}

export const VertexBezier: React.FC<VertexBezierProps> = (props) => {
  const { shape } = props;

  const start = shape.start.position;
  const allPoints = [shape.start, ...shape.subsequent];
  const commands = allPoints
    .slice(1)
    .reduce<Array<SvgPathCommand>>((acc, next, i) => {
      const prev = allPoints[i];
      const command = prev.draw(next);
      return [...acc, command];
    }, []);

  return (
    <SvgPath
      start={start}
      commands={commands}
      showMarkers={props.showMarkers}
    ></SvgPath>
  );
};
