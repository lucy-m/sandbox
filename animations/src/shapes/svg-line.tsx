import React from 'react';
import { Point } from './point';

interface SvgLineProps {
  start: Point;
  end: Point;
  stroke?: string;
}

export const SvgLine: React.FC<SvgLineProps> = (props) => {
  const start = props.start;
  const end = props.end;
  const stroke = props.stroke || 'black';

  return (
    <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={stroke} />
  );
};

export default SvgLine;
