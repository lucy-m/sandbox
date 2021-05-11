import { Point } from '../../../../shapes';
import { cartesianToPolar } from './cartesian-to-polar';

describe('CartesianToPolar', () => {
  it('Converts zero point to zero', () => {
    const cartesian: Point = {
      x: 0,
      y: 0,
    };

    const polar = cartesianToPolar(cartesian);

    expect(polar.radius).toBe(0);
    expect(polar.theta).toBe(0);
  });

  it('Converts point on positive X axis to 90 degrees', () => {
    const cartesian: Point = {
      x: 4,
      y: 0,
    };

    const polar = cartesianToPolar(cartesian);

    expect(polar.radius).toBe(4);
    expect(polar.theta).toBe(90);
  });

  it('Converts point on negative X axis to 270 degrees', () => {
    const cartesian: Point = {
      x: -4,
      y: 0,
    };

    const polar = cartesianToPolar(cartesian);

    expect(polar.radius).toBe(4);
    expect(polar.theta).toBe(270);
  });

  it('Converts point on positive Y axis to 0 degrees', () => {
    const cartesian: Point = {
      x: 0,
      y: 4,
    };

    const polar = cartesianToPolar(cartesian);

    expect(polar.radius).toBe(4);
    expect(polar.theta).toBe(0);
  });

  it('Converts point on negative Y axis to 180 degrees', () => {
    const cartesian: Point = {
      x: 0,
      y: -4,
    };

    const polar = cartesianToPolar(cartesian);

    expect(polar.radius).toBe(4);
    expect(polar.theta).toBe(180);
  });

  it('Converts first quadrant correctly', () => {
    const cartesian: Point = {
      x: 2,
      y: 2,
    };

    const polar = cartesianToPolar(cartesian);

    expect(polar.radius).toBeCloseTo(2 * Math.SQRT2);
    expect(polar.theta).toBe(45);
  });

  it('Converts second quadrant correctly', () => {
    const cartesian: Point = {
      x: 2,
      y: -2,
    };

    const polar = cartesianToPolar(cartesian);

    expect(polar.radius).toBeCloseTo(2 * Math.SQRT2);
    expect(polar.theta).toBe(135);
  });

  it('Converts third quadrant correctly', () => {
    const cartesian: Point = {
      x: -2,
      y: -2,
    };

    const polar = cartesianToPolar(cartesian);

    expect(polar.radius).toBeCloseTo(2 * Math.SQRT2);
    expect(polar.theta).toBe(225);
  });

  it('Converts fourth quadrant correctly', () => {
    const cartesian: Point = {
      x: -2,
      y: 2,
    };

    const polar = cartesianToPolar(cartesian);

    expect(polar.radius).toBeCloseTo(2 * Math.SQRT2);
    expect(polar.theta).toBe(315);
  });
});
