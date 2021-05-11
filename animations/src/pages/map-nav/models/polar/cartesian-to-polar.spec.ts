import { Converter } from '../converters/converter';
import { PolarPosition } from './polar-position';
import { CartesianPosition } from '../cartesian/cartesian';
import { CartesianToPolar } from './cartesian-to-polar';

describe('CartesianToPolar', () => {
  let converter: Converter<CartesianPosition, PolarPosition>;

  beforeEach(() => {
    converter = CartesianToPolar();
  });
  it('Converts zero point to zero', () => {
    const cartesian: CartesianPosition = {
      x: 0,
      y: 0
    };

    const polar = converter.convert(cartesian);

    expect(polar.radius).toBe(0);
    expect(polar.theta).toBe(0);
  });

  it('Converts point on positive X axis to 90 degrees', () => {
    const cartesian: CartesianPosition = {
      x: 4,
      y: 0
    };

    const polar = converter.convert(cartesian);

    expect(polar.radius).toBe(4);
    expect(polar.theta).toBe(90);
  });

  it('Converts point on negative X axis to 270 degrees', () => {
    const cartesian: CartesianPosition = {
      x: -4,
      y: 0
    };

    const polar = converter.convert(cartesian);

    expect(polar.radius).toBe(4);
    expect(polar.theta).toBe(270);
  });

  it('Converts point on positive Y axis to 0 degrees', () => {
    const cartesian: CartesianPosition = {
      x: 0,
      y: 4
    };

    const polar = converter.convert(cartesian);

    expect(polar.radius).toBe(4);
    expect(polar.theta).toBe(0);
  });

  it('Converts point on negative Y axis to 180 degrees', () => {
    const cartesian: CartesianPosition = {
      x: 0,
      y: -4
    };

    const polar = converter.convert(cartesian);

    expect(polar.radius).toBe(4);
    expect(polar.theta).toBe(180);
  });

  it('Converts first quadrant correctly', () => {
    const cartesian: CartesianPosition = {
      x: 2,
      y: 2
    };

    const polar = converter.convert(cartesian);

    expect(polar.radius).toBeCloseTo(2 * Math.SQRT2);
    expect(polar.theta).toBe(45);
  });

  it('Converts second quadrant correctly', () => {
    const cartesian: CartesianPosition = {
      x: 2,
      y: -2
    };

    const polar = converter.convert(cartesian);

    expect(polar.radius).toBeCloseTo(2 * Math.SQRT2);
    expect(polar.theta).toBe(135);
  });

  it('Converts third quadrant correctly', () => {
    const cartesian: CartesianPosition = {
      x: -2,
      y: -2
    };

    const polar = converter.convert(cartesian);

    expect(polar.radius).toBeCloseTo(2 * Math.SQRT2);
    expect(polar.theta).toBe(225);
  });

  it('Converts fourth quadrant correctly', () => {
    const cartesian: CartesianPosition = {
      x: -2,
      y: 2
    };

    const polar = converter.convert(cartesian);

    expect(polar.radius).toBeCloseTo(2 * Math.SQRT2);
    expect(polar.theta).toBe(315);
  });
});
