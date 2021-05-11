import { PolarPosition } from './polar-position';
import { CartesianPosition } from '../cartesian/cartesian';
import { Converter } from '../converters/converter';

export const PolarToCartesian = (): Converter<
  PolarPosition,
  CartesianPosition
> => {
  const convert = (polar: PolarPosition): CartesianPosition => {
    const { theta, radius } = polar;

    if (theta === 0) {
      return { x: 0, y: radius };
    } else if (theta === 90) {
      return { x: radius, y: 0 };
    } else if (theta === 180) {
      return { x: 0, y: -radius };
    } else if (theta === 270) {
      return { x: -radius, y: 0 };
    }

    const thetaRadians = (theta / 180) * Math.PI;
    const x = radius * Math.sin(thetaRadians);
    const y = radius * Math.cos(thetaRadians);

    return { x, y };
  };

  return { convert };
};
