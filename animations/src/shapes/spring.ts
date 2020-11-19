import { addPoint, Point, scale } from './point';

export interface Spring {
  position: Point;
  velocity: Point;
  endPoint: Point;
  stiffness: number;
  friction: number;
  weight: number;
}

const makeSpring = (
  position: Point,
  velocity: Point,
  endPoint: Point,
  stiffness: number,
  friction: number,
  weight: number
): Spring => ({
  position,
  velocity,
  endPoint,
  stiffness,
  friction,
  weight,
});

const tick = (spring: Spring, dt: number): Spring => {
  const { position, velocity, endPoint, stiffness, friction, weight } = spring;

  const d = addPoint(position, scale(endPoint, -1));
  const springAcc = scale(d, -stiffness / weight);
  const frictionAcc = scale(velocity, -friction / weight);
  const acc = scale(addPoint(springAcc, frictionAcc), 1 / dt);

  return {
    ...spring,
    position: addPoint(position, velocity),
    velocity: addPoint(velocity, acc),
  };
};

const setEndPoint = (spring: Spring, p: Point): Spring => ({
  ...spring,
  endPoint: p,
});

const setPosition = (spring: Spring, p: Point): Spring => ({
  ...spring,
  position: p,
});

export const SpringFn = {
  makeSpring,
  tick,
  setEndPoint,
  setPosition,
};
