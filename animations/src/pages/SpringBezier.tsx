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
import { innerZip, spacedFullZip } from './spring/zip';

export interface SpringBezierVertex {
  position: Spring;
  outGradient: Spring;
  inGradient: Spring;
  deleted: boolean;
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
    deleted: false,
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

  return { position, inGradient, outGradient, deleted: springs.deleted };
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

        return { position, inGradient, outGradient, deleted: s.deleted };
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
        vertex: Vertex,
        deleted: boolean
      ): SpringBezierVertex => {
        const position = SpringFn.setEndPoint(spring.position, vertex.position);
        const inGradient = SpringFn.setEndPoint(
          spring.inGradient,
          deleted ? Zero : vertex.inGrad
        );
        const outGradient = SpringFn.setEndPoint(
          spring.outGradient,
          vertex.outGrad
        );

        return { position, inGradient, outGradient, deleted };
      };

      // need to reset the outGradient for springs that are
      // immediately before a deleted one
      const springs = innerZip([start, ...subsequent], subsequent)
        .map(([spring, next]) => {
          if (next.deleted) {
            const outGradient = SpringFn.setPositionAndEndpoint(
              spring.outGradient,
              next.outGradient.position
            );
            return { ...spring, outGradient };
          } else {
            return spring;
          }
        })
        .concat(subsequent.slice(-1)[0])
        .filter((s) => !s.deleted);
      const zipped = spacedFullZip(springs, [shape.start, ...shape.subsequent]);

      const startSpringPairing = (() => {
        if (zipped[0] && zipped[0][0] && zipped[0][1]) {
          return { spring: zipped[0][0], vertex: zipped[0][1] };
        } else {
          return undefined;
        }
      })();

      if (startSpringPairing) {
        interface Acc {
          lastSpring: SpringBezierVertex;
          lastVertex: Vertex;
          subsequent: SpringBezierVertex[];
        }

        const morphedSubsequent = zipped.slice(1).reduce<Acc>(
          (acc, next) => {
            const spring = next[0] ?? acc.lastSpring;
            const vertex = next[1] ?? acc.lastVertex;
            const deleted = !next[1];

            const morphed = morphOne(spring, vertex, deleted);

            return {
              lastSpring: spring,
              lastVertex: vertex,
              subsequent: acc.subsequent.concat(morphed),
            };
          },
          {
            lastSpring: startSpringPairing.spring,
            lastVertex: startSpringPairing.vertex,
            subsequent: [],
          }
        ).subsequent;

        const morphedStart = morphOne(
          startSpringPairing.spring,
          startSpringPairing.vertex,
          false
        );

        // need to remove out-gradients for all springs
        // where the next spring is deleted
        const correctGradient = (
          spring: SpringBezierVertex,
          next: SpringBezierVertex
        ): SpringBezierVertex => {
          if (next.deleted) {
            const outGradient = SpringFn.setEndPoint(spring.outGradient, Zero);
            return { ...spring, outGradient };
          } else {
            return spring;
          }
        };

        const gradientCorrectedStart = morphedSubsequent[0]
          ? correctGradient(morphedStart, morphedSubsequent[0])
          : morphedStart;
        const gradientCorrectedSubsequent = innerZip(
          morphedSubsequent,
          morphedSubsequent.slice(1)
        )
          .map(([spring, next]) => correctGradient(spring, next))
          .concat(morphedSubsequent.slice(-1)[0]);

        setStart(gradientCorrectedStart);
        setSubsequent(gradientCorrectedSubsequent);
      }
    });

    return () => s?.unsubscribe();
  });

  const shape: VertexShape = {
    start: toVertex(start, origin),
    subsequent: subsequent.map((s) => toVertex(s, origin)),
  };

  return <VertexBezier shape={shape} showMarkers={true} />;
};
