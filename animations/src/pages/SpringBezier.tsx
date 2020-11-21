import React from 'react';
import { Observable } from 'rxjs';
import { Point, Zero } from '../shapes';
import { Spring, SpringFn, SpringProperties } from '../shapes/spring';
import { Sharp, Smooth, Vertex, VertexBezier } from '../shapes/vertex-bezier';

export interface SpringBezierVertex extends Spring {
  gradient?: Point;
}

export const makeSpringBezierMaker = (properties: SpringProperties) => (
  position: Point,
  gradient?: Point
): SpringBezierVertex => {
  const r = () => Math.random() * 0.2 + 0.9;
  const permutedProperties: SpringProperties = {
    stiffness: properties.stiffness * r(),
    friction: properties.friction * r(),
    weight: properties.weight * r(),
  };
  return {
    ...SpringFn.makeSpring(position, Zero, position, permutedProperties),
    gradient,
  };
};

const toVertex = (s: SpringBezierVertex): Vertex =>
  s.gradient ? Smooth(s.position, s.gradient) : Sharp(s.position);

interface SpringBezierProps {
  start: SpringBezierVertex;
  subsequent: SpringBezierVertex[];
  timer: Observable<number>;
  started: boolean;
  nudge: Observable<Point>;
}

export const SpringBezier: React.FC<SpringBezierProps> = (
  props: SpringBezierProps
) => {
  const { timer, started, nudge } = props;

  const [start, setStart] = React.useState<Spring>(props.start);
  const [subsequent, setSubsequent] = React.useState<Spring[]>(
    props.subsequent
  );

  React.useEffect(() => {
    const s = timer.subscribe((dt: number) => {
      if (started) {
        const apply = (s: Spring) => SpringFn.tick(s, dt);
        setStart(apply(start));
        setSubsequent(subsequent.map(apply));
      }
    });
    return () => s.unsubscribe();
  });

  React.useEffect(() => {
    const s = nudge.subscribe((n: Point) => {
      const r = () => Math.random() * 3 - 1.5;
      const apply = (s: Spring) =>
        SpringFn.setVelocity(SpringFn.nudgeEndPoint(s, n), { x: r(), y: r() });
      setStart(apply(start));
      setSubsequent(subsequent.map(apply));
    });
    return () => s.unsubscribe();
  });

  return (
    <VertexBezier
      start={toVertex(start)}
      subsequent={subsequent.map(toVertex)}
      showMarkers={true}
    />
  );
};
