import { addPoint, dist, Point, Zero } from '../../shapes';
import { Spring, SpringFn, SpringProperties } from '../../shapes/spring';
import { SmoothAsymm, Vertex, VertexShape } from '../../shapes/vertex-bezier';
import { leftNearestZip, spacedFullZip } from '../../util';

export interface SpringBezierVertex {
  position: Spring;
  outGradient: Spring;
  inGradient: Spring;
  mergedTo: 'next' | 'previous' | 'none';
  splitFrom: 'next' | 'previous' | 'none';
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
      mergedTo: 'none',
      splitFrom: 'none',
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

  return { ...springs, position, inGradient, outGradient };
};

type MorphOneFn = (
  spring: SpringBezierVertex,
  vertex: Vertex,
  mergeTo: 'next' | 'previous' | 'none',
  splitFrom: 'next' | 'previous' | 'none'
) => SpringBezierVertex;

export const morphOne = (
  spring: SpringBezierVertex,
  vertex: Vertex,
  mergedTo: 'next' | 'previous' | 'none',
  splitFrom: 'next' | 'previous' | 'none'
): SpringBezierVertex => {
  const position = SpringFn.setEndPoint(spring.position, vertex.position);

  const inGradient = (() => {
    const start = splitFrom === 'previous' ? Zero : spring.inGradient.position;
    const endPoint = mergedTo === 'previous' ? Zero : vertex.inGrad;

    return SpringFn.setEndPoint(
      SpringFn.setPosition(spring.inGradient, start),
      endPoint
    );
  })();

  const outGradient = (() => {
    const start = splitFrom === 'next' ? Zero : spring.outGradient.position;
    const endPoint = mergedTo === 'next' ? Zero : vertex.outGrad;

    return SpringFn.setEndPoint(
      SpringFn.setPosition(spring.outGradient, start),
      endPoint
    );
  })();

  return { position, inGradient, outGradient, mergedTo, splitFrom };
};

const gradientCorrectedMorph = (
  springShape: SpringBezierShape,
  morphSprings: (
    springs: SpringBezierVertex[],
    morphOne: MorphOneFn
  ) => SpringBezierVertex[]
): SpringBezierShape => {
  const { start, subsequent } = springShape;

  // need to reset the outGradient and inGradient for springs that are
  // connected to a spring that has been merged to them
  const allSprings = [start, ...subsequent];
  const springs = allSprings
    .map((spring, i) => {
      const prev = allSprings[i - 1];
      const next = allSprings[i + 1];

      const inGradient =
        prev && prev.mergedTo === 'next'
          ? SpringFn.setPositionAndEndpoint(
              spring.inGradient,
              prev.inGradient.position
            )
          : spring.inGradient;

      const outGradient =
        next && next.mergedTo === 'previous'
          ? SpringFn.setPositionAndEndpoint(
              spring.outGradient,
              next.outGradient.position
            )
          : spring.outGradient;

      return {
        ...spring,
        inGradient,
        outGradient,
      };
    })
    .filter((s) => s.mergedTo === 'none');

  const morphed = morphSprings(springs, morphOne);

  // need to remove outGradient or inGradient for
  // springs that have been merged
  const gradientCorrected = morphed.map((spring, i) => {
    const prev = morphed[i - 1];
    const next = morphed[i + 1];

    const outGradient = (() => {
      const endPoint =
        next && next.mergedTo === 'previous'
          ? SpringFn.setEndPoint(spring.outGradient, Zero)
          : spring.outGradient;

      const position =
        next && next.splitFrom === 'previous'
          ? SpringFn.setPosition(endPoint, Zero)
          : endPoint;

      return position;
    })();

    const inGradient = (() => {
      const endPoint =
        prev && prev.mergedTo === 'next'
          ? SpringFn.setEndPoint(spring.inGradient, Zero)
          : spring.inGradient;

      const position =
        next && next.splitFrom === 'next'
          ? SpringFn.setPosition(endPoint, Zero)
          : endPoint;

      return position;
    })();

    return {
      ...spring,
      inGradient,
      outGradient,
    };
  });

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
        'none',
        'none'
      );

      const morphedSubsequent = zipped.slice(1).reduce<Acc>(
        (acc, next) => {
          const spring = next[0] ?? acc.lastSpring;
          const splitFrom = next[0] ? 'none' : 'previous';
          const vertex = next[1] ?? acc.lastVertex;
          const morphTo = next[1] ? 'none' : 'previous';

          const morphed = morphOne(spring, vertex, morphTo, splitFrom);

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
      morphOne(spring, vertex, 'none', 'none')
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
