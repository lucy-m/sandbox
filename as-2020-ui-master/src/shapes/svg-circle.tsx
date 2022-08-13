import React from 'react';
import { Point } from '../converters/point';

interface SvgCircleProps {
  position: Point;
  radius: number;
  fill?: string;
  className?: string;
}

export const SvgCircle: React.FC<SvgCircleProps> = props => {
  const x = props.position.x;
  const y = props.position.y;
  const fill = props.fill || 'black';
  const className = props.className;

  return (
    <circle cx={x} cy={y} r={props.radius} fill={fill} className={className} />
  );
};

export default SvgCircle;
