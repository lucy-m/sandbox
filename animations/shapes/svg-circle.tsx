import React from 'react';
import { Point } from '../converters/point';

interface SvgCircleProps {
  position: Point;
  radius: number;
  fill?: string;
}

export const SvgCircle: React.FC<SvgCircleProps> = props => {
  const x = props.position.x;
  const y = props.position.y;
  const fill = props.fill || 'black';

  return <circle cx={x} cy={y} r={props.radius} fill={fill} />;
};

export default SvgCircle;
