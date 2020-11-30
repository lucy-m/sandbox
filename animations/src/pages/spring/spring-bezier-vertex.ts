import { addPoint, Point, Zero } from '../../shapes';
import { Spring, SpringFn, SpringProperties } from '../../shapes/spring';
import { SmoothAsymm, Vertex } from '../../shapes/vertex-bezier';

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

const apply = (
  springs: SpringBezierVertex,
  fn: (s: Spring) => Spring
): SpringBezierVertex => {
  const position = fn(springs.position);
  const inGradient = springs.inGradient && fn(springs.inGradient);
  const outGradient = springs.outGradient && fn(springs.outGradient);

  return { position, inGradient, outGradient, deleted: springs.deleted };
};

export const SpringBezierFn = {
  toVertex,
  apply,
};
