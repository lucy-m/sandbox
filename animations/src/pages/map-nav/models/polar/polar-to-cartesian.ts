import { Point } from '../../../../shapes';
import { PolarPosition } from './polar-position';

export const polarToCartesian = (polar: PolarPosition): Point => {
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
