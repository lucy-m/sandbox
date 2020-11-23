import React from 'react';
import { Observable } from 'rxjs';
import { addPoint, Point, Zero } from '../shapes';
import { Spring, SpringFn, SpringProperties } from '../shapes/spring';
import {
  SmoothAsymm,
  Vertex,
  VertexBezier,
  VertexShape,
} from '../shapes/vertex-bezier';

export interface SpringBezierVertex {
  position: Spring;
  outGradient: Spring;
  inGradient: Spring;
}

export const makeSpringBezierMaker = (properties: SpringProperties) => (
  vertex: Vertex
): SpringBezierVertex => {
  const r = () => Math.random() * 0.2 + 0.9;

  const makeSpring = (p: Point): Spring => {
    const permutedProperties: SpringProperties = {
      stiffness: properties.stiffness * r(),
      friction: properties.friction * r(),
      weight: properties.weight * r(),
    };
    return SpringFn.makeSpring(p, Zero, p, permutedProperties);
  };

  return {
    position: makeSpring(vertex.position),
    inGradient: makeSpring(vertex.inGrad),
    outGradient: makeSpring(vertex.outGrad),
  };
};

const toVertex = (s: SpringBezierVertex, origin: Point): Vertex =>
  SmoothAsymm(
    addPoint(s.position.position, origin),
    s.inGradient.position,
    s.outGradient.position
  );

export interface SpringBezierShape {
  start: SpringBezierVertex;
  subsequent: SpringBezierVertex[];
}

interface SpringBezierProps {
  initial: SpringBezierShape;
  origin?: Point;
  timer: Observable<number>;
  started: boolean;
  nudge?: Observable<Point>;
  morph?: Observable<VertexShape>;
}

const apply = (
  springs: SpringBezierVertex,
  fn: (s: Spring) => Spring
): SpringBezierVertex => {
  const position = fn(springs.position);
  const inGradient = springs.inGradient && fn(springs.inGradient);
  const outGradient = springs.outGradient && fn(springs.outGradient);

  return { position, inGradient, outGradient };
};

export const SpringBezier: React.FC<SpringBezierProps> = (
  props: SpringBezierProps
) => {
  const { timer, started, nudge, morph } = props;
  const origin = props.origin ?? Zero;

  const [start, setStart] = React.useState<SpringBezierVertex>(
    props.initial.start
  );
  const [subsequent, setSubsequent] = React.useState<SpringBezierVertex[]>(
    props.initial.subsequent
  );

  React.useEffect(() => {
    const s = timer.subscribe((dt: number) => {
      if (started) {
        const fn = (s: Spring) => SpringFn.tick(s, dt);

        setStart(apply(start, fn));
        setSubsequent(subsequent.map((s) => apply(s, fn)));
      }
    });
    return () => s.unsubscribe();
  });

  React.useEffect(() => {
    const s = nudge?.subscribe((n: Point) => {
      const r = () => Math.random() * 3 - 1.5;
      const apply = (s: SpringBezierVertex): SpringBezierVertex => {
        const position = SpringFn.setVelocity(
          SpringFn.nudgeEndPoint(s.position, n),
          { x: r(), y: r() }
        );
        const inGradient =
          s.inGradient &&
          SpringFn.setVelocity(s.inGradient, { x: r(), y: r() });
        const outGradient =
          s.outGradient &&
          SpringFn.setVelocity(s.outGradient, { x: r(), y: r() });

        return { position, inGradient, outGradient };
      };
      setStart(apply(start));
      setSubsequent(subsequent.map(apply));
    });
    return () => s?.unsubscribe();
  });

  React.useEffect(() => {
    const s = morph?.subscribe((shape: VertexShape) => {
      const morphOne = (
        spring: SpringBezierVertex,
        vertex: Vertex
      ): SpringBezierVertex => {
        const position = SpringFn.setEndPoint(spring.position, vertex.position);
        const inGradient = SpringFn.setEndPoint(
          spring.inGradient,
          vertex.inGrad
        );
        const outGradient = SpringFn.setEndPoint(
          spring.outGradient,
          vertex.outGrad
        );

        return { position, inGradient, outGradient };
      };

      const newSubsequent = shape.subsequent
        .slice(0, subsequent.length)
        .map((v, i) => morphOne(subsequent[i], v));

      setStart(morphOne(start, shape.start));
      setSubsequent(newSubsequent);
    });

    return () => s?.unsubscribe();
  });

  const shape: VertexShape = {
    start: toVertex(start, origin),
    subsequent: subsequent.map((s) => toVertex(s, origin)),
  };

  return <VertexBezier shape={shape} showMarkers={false} />;
};
