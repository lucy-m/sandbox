import React from 'react';
import { Point } from '../converters/point';
import { SvgPath } from '../shapes/svg-path';
import { LineAbs } from '../shapes/svg-path-commands';
import { IS_DEV } from '../constants';

interface ValidPlayerProps {
  points: Array<Point>;
  onClick?: (e: React.MouseEvent) => void;
  devFill?: string;
}

export const InteractionZone: React.FC<ValidPlayerProps> = (
  props: ValidPlayerProps
) => {
  const validPlayerPositions = props.points;
  const onClick = props.onClick ? props.onClick : () => {};
  const fill = !IS_DEV
    ? 'hsla(0, 0%, 0%, 0)'
    : props.devFill || 'hsla(10, 80%, 70%, 0.3)';
  const stroke = IS_DEV ? 'black' : 'none';

  return SvgPath({
    start: validPlayerPositions[0],
    commands: validPlayerPositions.slice(1).map(p => LineAbs(p)),
    showMarkers: IS_DEV,
    closePath: true,
    onClick: onClick,
    fill: fill,
    stroke: stroke
  });
};

export default InteractionZone;
