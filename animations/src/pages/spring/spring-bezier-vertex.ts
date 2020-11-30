import { addPoint, dist, Point, Zero } from '../../shapes';
import { Spring, SpringFn, SpringProperties } from '../../shapes/spring';
import { SmoothAsymm, Vertex, VertexShape } from '../../shapes/vertex-bezier';
import { innerZip, leftNearestZip, spacedFullZip } from '../../util';

export interface SpringBezierVertex {
  position: Spring;
  outGradient: Spring;
  inGradient: Spring;
  deleted: boolean;
}

export interface SpringBezierShape {
  start: SpringBezierVertex;
  subsequent: SpringBezierVertex[];
}

export interface SpringBezierMaker {
  vertex: (v: Vertex) => SpringBezierVertex;
  shape: (s: VertexShape) => SpringBezierShape;
}

export const makeSpringBezierMaker = (
  properties: SpringProperties,
  randomPermute: boolean
): SpringBezierMaker => {
  const vertex = (v: Vertex): SpringBezierVertex => {
    const r = () => (randomPermute ? Math.random() * 0.2 + 0.9 : 1);

    const makeSpring = (p: Point): Spring => {
      const permutedProperties: SpringProperties = {
        stiffness: properties.stiffness * r(),
        friction: properties.friction * r(),
        weight: properties.weight * r(),
      };
      return SpringFn.makeSpring(p, Zero, p, permutedProperties);
    };

    return {
      position: makeSpring(v.position),
      inGradient: makeSpring(v.inGrad),
      outGradient: makeSpring(v.outGrad),
      deleted: false,
    };
  };

  const shape = (s: VertexShape): SpringBezierShape => ({
    start: vertex(s.start),
    subsequent: s.subsequent.map(vertex),
  });

  return { vertex, shape };
};

const toVertex = (s: SpringBezierVertex, origin: Point): Vertex =>
  SmoothAsymm(
    addPoint(s.position.position, origin),
    s.inGradient.position,
    s.outGradient.position
  );

const apply = (
  springs: SpringBezierVertex,
  fn: (s: Spring) => Spring
): SpringBezierVertex => {
  const position = fn(springs.position);
  const inGradient = springs.inGradient && fn(springs.inGradient);
  const outGradient = springs.outGradient && fn(springs.outGradient);

  return { position, inGradient, outGradient, deleted: springs.deleted };
};

type MorphOneFn = (
  spring: SpringBezierVertex,
  vertex: Vertex,
  deleted: boolean
) => SpringBezierVertex;

const gradientCorrectedMorph = (
  springShape: SpringBezierShape,
  morphSprings: (
    springs: SpringBezierVertex[],
    morphOne: MorphOneFn
  ) => SpringBezierVertex[]
): SpringBezierShape => {
  const { start, subsequent } = springShape;

  const morphOne: MorphOneFn = (
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

  const morphed = morphSprings(springs, morphOne);

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

  const gradientCorrected = innerZip(morphed, morphed.slice(1))
    .map(([spring, next]) => correctGradient(spring, next))
    .concat(morphed.slice(-1)[0]);

  return {
    start: gradientCorrected[0] ?? start,
    subsequent: gradientCorrected.slice(1),
  };
};

const spacedMorph = (
  springShape: SpringBezierShape,
  vertexShape: VertexShape
): SpringBezierShape => {
  const morphSprings = (
    springs: SpringBezierVertex[],
    morphOne: MorphOneFn
  ): SpringBezierVertex[] => {
    const zipped = spacedFullZip(springs, [
      vertexShape.start,
      ...vertexShape.subsequent,
    ]);

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

      const morphedStart = morphOne(
        startSpringPairing.spring,
        startSpringPairing.vertex,
        false
      );

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

      return [morphedStart, ...morphedSubsequent];
    } else {
      return springs;
    }
  };

  return gradientCorrectedMorph(springShape, morphSprings);
};

const nearestMorph = (
  springShape: SpringBezierShape,
  vertexShape: VertexShape
): SpringBezierShape => {
  const morphSprings = (
    springs: SpringBezierVertex[],
    morphOne: MorphOneFn
  ): SpringBezierVertex[] => {
    const vertices = [vertexShape.start, ...vertexShape.subsequent];

    // we want to ensure all existing springs go somewhere
    // build a reverse map of spring to vertex
    const reverseSpringToVertex = new Map(
      leftNearestZip(springs, vertices, (s, v) =>
        dist(s.position.position, v.position)
      ).map(([a, b]) => [b, a])
    );

    // map of vertex to nearest spring as backup
    const vertexToSpring = new Map(
      leftNearestZip(vertices, springs, (v, s) =>
        dist(v.position, s.position.position)
      )
    );

    // for each vertex, if it is assigned to an existing spring
    // then use that, else use its nearest vertex
    const springVertexPairings = vertices.map((vertex) => {
      const spring =
        reverseSpringToVertex.get(vertex) ?? vertexToSpring.get(vertex)!;

      return {
        spring,
        vertex,
      };
    });

    const morphed = springVertexPairings.map(({ spring, vertex }) =>
      morphOne(spring, vertex, false)
    );

    return morphed;
  };

  return gradientCorrectedMorph(springShape, morphSprings);
};

export const SpringBezierFn = {
  toVertex,
  apply,
  spacedMorph,
  nearestMorph,
};
