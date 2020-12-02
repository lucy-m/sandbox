import { addPoint, Point, scale } from './point';

export interface SpringProperties {
  stiffness: number;
  friction: number;
  weight: number;
}

export interface Spring {
  position: Point;
  velocity: Point;
  endPoint: Point;
  properties: SpringProperties;
}

const makeSpring = (
  position: Point,
  velocity: Point,
  endPoint: Point,
  properties: SpringProperties
): Spring => ({
  position,
  velocity,
  endPoint,
  properties,
});

const tick = (spring: Spring, dt: number): Spring => {
  const {
    position,
    velocity,
    endPoint,
    properties: { stiffness, friction, weight },
  } = spring;

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

const nudgeEndPoint = (spring: Spring, dp: Point): Spring => ({
  ...spring,
  endPoint: addPoint(spring.endPoint, dp),
});

const setVelocity = (spring: Spring, v: Point): Spring => ({
  ...spring,
  velocity: v,
});

const setPosition = (spring: Spring, p: Point): Spring => ({
  ...spring,
  position: p,
});

const setPositionAndEndpoint = (spring: Spring, p: Point): Spring =>
  setEndPoint(setPosition(spring, p), p);

export const SpringFn = {
  makeSpring,
  tick,
  setEndPoint,
  nudgeEndPoint,
  setVelocity,
  setPosition,
  setPositionAndEndpoint,
};
