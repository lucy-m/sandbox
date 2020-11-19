import React from 'react';
import { Point, addPoint, scale } from '../converters/point';
import { SvgPathCommand, CurveRel } from './svg-path-commands';
import { SvgPath } from './svg-path';

export interface Vertex {
  position: Point;
  gradient: Point;
  draw: (next: Vertex) => SvgPathCommand;
}

export const Smooth = (position: Point, gradient: Point): Vertex => {
  const draw = (next: Vertex): SvgPathCommand => {
    const dp = addPoint(next.position, scale(position, -1));
    const startControlRel = gradient;
    const endControlRel = scale(next.gradient, -1);

    return CurveRel(dp, startControlRel, endControlRel);
  };

  return {
    position,
    gradient,
    draw
  };
};

export const Sharp = (position: Point): Vertex =>
  Smooth(position, { x: 0, y: 0 });

interface VertexBezierProps {
  start: Vertex;
  subsequent: Array<Vertex>;
  showMarkers?: boolean;
}

export const VertexBezier: React.FC<VertexBezierProps> = props => {
  const start = props.start.position;
  const allPoints = [props.start, ...props.subsequent];
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
