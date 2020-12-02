import {
  addPoint,
  getPoints,
  Point,
  scale,
  Shape,
  SpringFn,
  SpringProperties,
  SpringShape,
  Zero,
} from '../../shapes';

export type BoneShape = Shape<Point>;

export const toSpringShape = (
  shape: BoneShape,
  properties: SpringProperties
): SpringShape => {
  const start = SpringFn.makeSpring(shape.start, Zero, shape.start, properties);
  const subsequent = shape.subsequent.map((s) =>
    SpringFn.makeSpring(s, Zero, s, properties)
  );

  return { start, subsequent };
};

export const tick = (
  springShape: SpringShape,
  base: BoneShape,
  dt: number
): SpringShape => {
  // adjust endpoints to remain a constant offset between points
  const points = getPoints(base);
  const allSprings = getPoints(springShape);

  const adjusted = allSprings.map((spring, i) => {
    const prevSpring = allSprings[i - 1];
    const thisPoint = points[i];
    const prevPoint = points[i - 1];

    if (prevSpring && thisPoint && prevPoint) {
      const offset = addPoint(thisPoint, scale(prevPoint, -1));
      const endPoint = addPoint(prevSpring.position, offset);

      return { ...spring, endPoint };
    } else {
      return spring;
    }
  });

  // tick all springs
  const ticked: SpringShape = (() => {
    const springs = adjusted.map((s) => SpringFn.tick(s, dt));
    const start = springs[0];
    const subsequent = springs.slice(1);

    return { start, subsequent };
  })();

  return ticked;
};
