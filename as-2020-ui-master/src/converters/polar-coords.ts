import { Position } from './model';

export interface PolarPosition {
  radius: number;
  theta: number;
}

export const toPolar = ({ position: cartesian }: Position): PolarPosition => {
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

export const toCartesian = ({ radius, theta }: PolarPosition): Position => {
  if (theta === 0) {
    return { position: { x: 0, y: radius } };
  } else if (theta === 90) {
    return { position: { x: radius, y: 0 } };
  } else if (theta === 180) {
    return { position: { x: 0, y: -radius } };
  } else if (theta === 270) {
    return { position: { x: -radius, y: 0 } };
  }

  const thetaRadians = (theta / 180) * Math.PI;
  const x = radius * Math.sin(thetaRadians);
  const y = radius * Math.cos(thetaRadians);

  return { position: { x, y } };
};
