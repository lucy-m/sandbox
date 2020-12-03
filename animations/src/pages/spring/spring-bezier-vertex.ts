import { dist, Point, Shape, Zero } from '../../shapes';
import { Spring, SpringFn, SpringProperties } from '../../shapes/spring';
import {
  Sharp,
  SmoothAsymm,
  Vertex,
  VertexShape,
} from '../../shapes/VertexBezier';
import { leftNearestZip, spacedFullZip } from '../../util';

type MergedTo = 'next' | 'previous' | 'none';
type SplitFrom = 'next' | 'previous' | 'none';

export interface SpringBezierVertex {
  position: Spring;
  outGradient: Spring;
  inGradient: Spring;
  mergedTo: MergedTo;
  splitFrom: SplitFrom;
}

export type SpringBezierShape = Shape<SpringBezierVertex>;

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

const toVertex = (s: SpringBezierVertex): Vertex =>
  SmoothAsymm(
    s.position.position,
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
  mergeTo: MergedTo,
  splitFrom: SplitFrom
) => SpringBezierVertex;

export const morphOne = (
  spring: SpringBezierVertex,
  vertex: Vertex,
  mergedTo: MergedTo,
  splitFrom: SplitFrom
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

    const vertexToSpring = leftNearestZip(vertices, springs, (v, s) =>
      dist(v.position, s.position.position)
    );

    const additionalSprings = (() => {
      const deletedSprings = springs
        .map((spring, i) => {
          const vertex = vertexToSpring.find(([_, s]) => s === spring);
          const deleted = !vertex;

          return { spring, i, deleted };
        })
        .filter(({ deleted }) => deleted);

      interface MergeToVertexResult {
        vertex: Vertex;
        mergedTo: MergedTo;
      }
      const getMergeToVertex = (
        index: number
      ): MergeToVertexResult | undefined => {
        const getMorphSpringInner = (
          step: number
        ): MergeToVertexResult | undefined => {
          if (step > springs.length) {
            return undefined;
          }
          const lower = springs[index - step];
          const upper = springs[index + step];

          if (lower) {
            const vertex = vertexToSpring.find(([_, s]) => s === lower);
            if (vertex) {
              return {
                vertex: vertex[0],
                mergedTo: 'previous',
              };
            }
          }
          if (upper) {
            const vertex = vertexToSpring.find(([_, s]) => s === upper);
            if (vertex) {
              return {
                vertex: vertex[0],
                mergedTo: 'next',
              };
            }
          }

          return getMorphSpringInner(step + 1);
        };

        return getMorphSpringInner(1);
      };

      const additionalSprings = deletedSprings
        .map(({ spring, i }) => {
          const result = getMergeToVertex(i);
          return { spring, mergeToVertex: result };
        })
        .filter(({ mergeToVertex }) => !!mergeToVertex);

      return additionalSprings as {
        spring: SpringBezierVertex;
        mergeToVertex: MergeToVertexResult;
      }[];
    })();

    const allSprings = vertexToSpring
      .map((entry) => {
        const makeEntry = (
          spring: SpringBezierVertex,
          vertex: Vertex,
          mergedTo: MergedTo,
          splitFrom: SplitFrom
        ) => ({
          spring,
          vertex,
          mergedTo,
          splitFrom,
        });

        const [v, spring] = entry;
        const mySprings = additionalSprings.filter(
          ({ mergeToVertex }) => mergeToVertex.vertex === v
        );
        const priorSprings = mySprings
          .filter(({ mergeToVertex }) => mergeToVertex.mergedTo === 'next')
          .map(({ spring }) => makeEntry(spring, v, 'next', 'none'));
        const afterSprings = mySprings
          .filter(({ mergeToVertex }) => mergeToVertex.mergedTo === 'previous')
          .map(({ spring }) => makeEntry(spring, v, 'previous', 'none'));

        return [
          ...priorSprings,
          makeEntry(spring, v, 'none', 'none'),
          ...afterSprings,
        ];
      })
      .reduce((a, b) => a.concat(b), []);

    const morphed = allSprings.map(({ spring, vertex, mergedTo, splitFrom }) =>
      morphOne(spring, vertex, mergedTo, splitFrom)
    );

    return morphed;
  };

  return gradientCorrectedMorph(springShape, morphSprings);
};

const getSpringDisplays = (shape: SpringBezierShape): VertexShape[] => {
  const springs = [shape.start, ...shape.subsequent].map((v) => v.position);
  return springs.map((spring) => ({
    start: Sharp(spring.position),
    subsequent: [Sharp(spring.endPoint)],
  }));
};

export const SpringBezierFn = {
  toVertex,
  apply,
  spacedMorph,
  nearestMorph,
  getSpringDisplays,
};
