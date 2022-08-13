import { Position } from '../model';
import { toPolar, PolarPosition, toCartesian } from '../polar-coords';

export default describe('PolarCoOrds', () => {
  describe('toPolar', () => {
    it('Converts zero point to zero', () => {
      const cartesian: Position = {
        position: {
          x: 0,
          y: 0
        }
      };

      const polar = toPolar(cartesian);

      expect(polar.radius).toBe(0);
      expect(polar.theta).toBe(0);
    });

    it('Converts point on positive X axis to 90 degrees', () => {
      const cartesian: Position = {
        position: {
          x: 4,
          y: 0
        }
      };

      const polar = toPolar(cartesian);

      expect(polar.radius).toBe(4);
      expect(polar.theta).toBe(90);
    });

    it('Converts point on negative X axis to 270 degrees', () => {
      const cartesian: Position = {
        position: {
          x: -4,
          y: 0
        }
      };

      const polar = toPolar(cartesian);

      expect(polar.radius).toBe(4);
      expect(polar.theta).toBe(270);
    });

    it('Converts point on positive Y axis to 0 degrees', () => {
      const cartesian: Position = {
        position: {
          x: 0,
          y: 4
        }
      };

      const polar = toPolar(cartesian);

      expect(polar.radius).toBe(4);
      expect(polar.theta).toBe(0);
    });

    it('Converts point on negative Y axis to 180 degrees', () => {
      const cartesian: Position = {
        position: {
          x: 0,
          y: -4
        }
      };

      const polar = toPolar(cartesian);

      expect(polar.radius).toBe(4);
      expect(polar.theta).toBe(180);
    });

    it('Converts first quadrant correctly', () => {
      const cartesian: Position = {
        position: {
          x: 2,
          y: 2
        }
      };

      const polar = toPolar(cartesian);

      expect(polar.radius).toBeCloseTo(2 * Math.SQRT2);
      expect(polar.theta).toBe(45);
    });

    it('Converts second quadrant correctly', () => {
      const cartesian: Position = {
        position: {
          x: 2,
          y: -2
        }
      };

      const polar = toPolar(cartesian);

      expect(polar.radius).toBeCloseTo(2 * Math.SQRT2);
      expect(polar.theta).toBe(135);
    });

    it('Converts third quadrant correctly', () => {
      const cartesian: Position = {
        position: {
          x: -2,
          y: -2
        }
      };

      const polar = toPolar(cartesian);

      expect(polar.radius).toBeCloseTo(2 * Math.SQRT2);
      expect(polar.theta).toBe(225);
    });

    it('Converts fourth quadrant correctly', () => {
      const cartesian: Position = {
        position: {
          x: -2,
          y: 2
        }
      };

      const polar = toPolar(cartesian);

      expect(polar.radius).toBeCloseTo(2 * Math.SQRT2);
      expect(polar.theta).toBe(315);
    });
  });

  describe('toCartesian', () => {
    it('Converts zero point to zero', () => {
      const polar: PolarPosition = {
        radius: 0,
        theta: 0
      };

      const cartesian = toCartesian(polar).position;

      expect(cartesian.x).toBe(0);
      expect(cartesian.y).toBe(0);
    });

    it('Converts 90 degrees to point on positive X axis', () => {
      const polar: PolarPosition = {
        radius: 4,
        theta: 90
      };

      const cartesian = toCartesian(polar).position;

      expect(cartesian.x).toBe(4);
      expect(cartesian.y).toBe(0);
    });

    it('Converts 270 degrees to point on negative X axis', () => {
      const polar: PolarPosition = {
        radius: 4,
        theta: 270
      };

      const cartesian = toCartesian(polar).position;

      expect(cartesian.x).toBe(-4);
      expect(cartesian.y).toBe(0);
    });

    it('Converts 0 degrees to point on positive Y axis', () => {
      const polar: PolarPosition = {
        radius: 4,
        theta: 0
      };

      const cartesian = toCartesian(polar).position;

      expect(cartesian.x).toBe(0);
      expect(cartesian.y).toBe(4);
    });

    it('Converts 180 degrees to point on negative Y axis', () => {
      const polar: PolarPosition = {
        radius: 4,
        theta: 180
      };

      const cartesian = toCartesian(polar).position;

      expect(cartesian.x).toBe(0);
      expect(cartesian.y).toBe(-4);
    });

    it('Converts first quadrant correctly', () => {
      const polar: PolarPosition = {
        radius: 2,
        theta: 30
      };

      const cartesian = toCartesian(polar).position;

      expect(cartesian.x).toBeCloseTo(1);
      expect(cartesian.y).toBeCloseTo(Math.sqrt(3));
    });

    it('Converts second quadrant correctly', () => {
      const polar: PolarPosition = {
        radius: 2,
        theta: 150
      };

      const cartesian = toCartesian(polar).position;

      expect(cartesian.x).toBeCloseTo(1);
      expect(cartesian.y).toBeCloseTo(-Math.sqrt(3));
    });

    it('Converts third quadrant correctly', () => {
      const polar: PolarPosition = {
        radius: 2,
        theta: 210
      };

      const cartesian = toCartesian(polar).position;

      expect(cartesian.x).toBeCloseTo(-1);
      expect(cartesian.y).toBeCloseTo(-Math.sqrt(3));
    });

    it('Converts fourth quadrant correctly', () => {
      const polar: PolarPosition = {
        radius: 2,
        theta: 330
      };

      const cartesian = toCartesian(polar).position;

      expect(cartesian.x).toBeCloseTo(-1);
      expect(cartesian.y).toBeCloseTo(Math.sqrt(3));
    });

    it('Works for degrees < 0', () => {
      const positiveAngle: PolarPosition = {
        radius: 2,
        theta: 330
      };

      const negativeAngle: PolarPosition = {
        radius: 2,
        theta: -30
      };

      const positiveCartesian = toCartesian(positiveAngle).position;
      const negativeCartesian = toCartesian(negativeAngle).position;

      expect(positiveCartesian.x).toBeCloseTo(negativeCartesian.x);
      expect(positiveCartesian.y).toBeCloseTo(negativeCartesian.y);
    });

    it('Works for degrees > 360', () => {
      const smallAngle: PolarPosition = {
        radius: 2,
        theta: 15
      };

      const bigAngle: PolarPosition = {
        radius: 2,
        theta: 375
      };

      const bigCartesian = toCartesian(bigAngle).position;
      const smallCartesian = toCartesian(smallAngle).position;

      expect(bigCartesian.x).toBeCloseTo(smallCartesian.x);
      expect(bigCartesian.y).toBeCloseTo(smallCartesian.y);
    });
  });
});
