import React from 'react';
import { SvgPathCommand, MoveAbs } from './svg-path-commands';
import { Point } from '../converters/point';

interface SvgPathProps {
  start: Point;
  commands: Array<SvgPathCommand>;
  showMarkers?: boolean;
  closePath?: boolean;
  fill?: string;
  stroke?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const SvgPath: React.FC<SvgPathProps> = props => {
  const initial = MoveAbs(props.start);
  const d =
    props.commands.reduce(
      (str, command) => str + command.draw(),
      initial.draw()
    ) + (props.closePath ? 'z' : '');
  const fill = props.fill || 'none';
  const onClick = props.onClick ? props.onClick : () => {};
  const path = (
    <path d={d} stroke={props.stroke} fill={fill} onClick={onClick} />
  );
  if (!props.showMarkers) {
    return path;
  }
  const endSegmentMarkers = props.commands.reduce(
    ({ segmentStart, acc }, command) => {
      return {
        segmentStart: command.move(segmentStart),
        acc: acc.concat(command.markers(segmentStart))
      };
    },
    { segmentStart: props.start, acc: [initial.markers(props.start)] }
  ).acc;

  return (
    <g>
      {path}
      {endSegmentMarkers}
    </g>
  );
};
