import { Point } from '../../../../shapes';
import { PolarPosition } from './polar-position';

export const cartesianToPolar = (cartesian: Point): PolarPosition => {
  const radius = Math.sqrt(Math.pow(cartesian.x, 2) + Math.pow(cartesian.y, 2));

  if (radius === 0) {
    const theta = 0;
    return { radius, theta };
  } else if (cartesian.y === 0) {
    const theta = cartesian.x > 0 ? 90 : 270;
    return { radius, theta };
  } else {
    const unAdjustedTheta =
      (Math.atan(cartesian.x / cartesian.y) * 180) / Math.PI;
    const yAdjustedTheta = unAdjustedTheta + (cartesian.y > 0 ? 0 : 180);
    const theta = yAdjustedTheta < 0 ? yAdjustedTheta + 360 : yAdjustedTheta;
    return { radius, theta };
  }
};
