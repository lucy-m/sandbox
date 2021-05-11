import { PolarPosition } from './polar-position';
import { polarToCartesian } from './polar-to-cartesian';

describe('PolarToCartesian', () => {
  it('Converts zero point to zero', () => {
    const polar: PolarPosition = {
      radius: 0,
      theta: 0,
    };

    const cartesian = polarToCartesian(polar);

    expect(cartesian.x).toBe(0);
    expect(cartesian.y).toBe(0);
  });

  it('Converts 90 degrees to point on positive X axis', () => {
    const polar: PolarPosition = {
      radius: 4,
      theta: 90,
    };

    const cartesian = polarToCartesian(polar);

    expect(cartesian.x).toBe(4);
    expect(cartesian.y).toBe(0);
  });

  it('Converts 270 degrees to point on negative X axis', () => {
    const polar: PolarPosition = {
      radius: 4,
      theta: 270,
    };

    const cartesian = polarToCartesian(polar);

    expect(cartesian.x).toBe(-4);
    expect(cartesian.y).toBe(0);
  });

  it('Converts 0 degrees to point on positive Y axis', () => {
    const polar: PolarPosition = {
      radius: 4,
      theta: 0,
    };

    const cartesian = polarToCartesian(polar);

    expect(cartesian.x).toBe(0);
    expect(cartesian.y).toBe(4);
  });

  it('Converts 180 degrees to point on negative Y axis', () => {
    const polar: PolarPosition = {
      radius: 4,
      theta: 180,
    };

    const cartesian = polarToCartesian(polar);

    expect(cartesian.x).toBe(0);
    expect(cartesian.y).toBe(-4);
  });

  it('Converts first quadrant correctly', () => {
    const polar: PolarPosition = {
      radius: 2,
      theta: 30,
    };

    const cartesian = polarToCartesian(polar);

    expect(cartesian.x).toBeCloseTo(1);
    expect(cartesian.y).toBeCloseTo(Math.sqrt(3));
  });

  it('Converts second quadrant correctly', () => {
    const polar: PolarPosition = {
      radius: 2,
      theta: 150,
    };

    const cartesian = polarToCartesian(polar);

    expect(cartesian.x).toBeCloseTo(1);
    expect(cartesian.y).toBeCloseTo(-Math.sqrt(3));
  });

  it('Converts third quadrant correctly', () => {
    const polar: PolarPosition = {
      radius: 2,
      theta: 210,
    };

    const cartesian = polarToCartesian(polar);

    expect(cartesian.x).toBeCloseTo(-1);
    expect(cartesian.y).toBeCloseTo(-Math.sqrt(3));
  });

  it('Converts fourth quadrant correctly', () => {
    const polar: PolarPosition = {
      radius: 2,
      theta: 330,
    };

    const cartesian = polarToCartesian(polar);

    expect(cartesian.x).toBeCloseTo(-1);
    expect(cartesian.y).toBeCloseTo(Math.sqrt(3));
  });

  it('Works for degrees < 0', () => {
    const positiveAngle: PolarPosition = {
      radius: 2,
      theta: 330,
    };

    const negativeAngle: PolarPosition = {
      radius: 2,
      theta: -30,
    };

    const positiveCartesian = polarToCartesian(positiveAngle);
    const negativeCartesian = polarToCartesian(negativeAngle);

    expect(positiveCartesian.x).toBeCloseTo(negativeCartesian.x);
    expect(positiveCartesian.y).toBeCloseTo(negativeCartesian.y);
  });

  it('Works for degrees > 360', () => {
    const smallAngle: PolarPosition = {
      radius: 2,
      theta: 15,
    };

    const bigAngle: PolarPosition = {
      radius: 2,
      theta: 375,
    };

    const bigCartesian = polarToCartesian(bigAngle);
    const smallCartesian = polarToCartesian(smallAngle);

    expect(bigCartesian.x).toBeCloseTo(smallCartesian.x);
    expect(bigCartesian.y).toBeCloseTo(smallCartesian.y);
  });
});
