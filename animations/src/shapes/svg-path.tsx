import React from 'react';
import { SvgPathCommand, MoveAbs } from './svg-path-commands';
import { Point } from '../converters/point';

interface SvgPathProps {
  start: Point;
  commands: Array<SvgPathCommand>;
  showMarkers?: boolean;
}

export const SvgPath: React.FC<SvgPathProps> = props => {
  const initial = MoveAbs(props.start);
  const d = props.commands.reduce(
    (str, command) => str + command.draw(),
    initial.draw()
  );
  const path = <path d={d} stroke="black" fill="none" />;
  if (!props.showMarkers) {
    return path;
  }
  const endSegmentMarkers = props.commands.reduce(
    ({ segmentStart, acc }, command, i) => {
      return {
        segmentStart: command.move(segmentStart),
        acc: acc.concat(<g key={i + 1}>{command.markers(segmentStart)}</g>)
      };
    },
    {
      segmentStart: props.start,
      acc: [<g key={0}>{initial.markers(props.start)}</g>]
    }
  ).acc;

  return (
    <g>
      {path}
      {endSegmentMarkers}
    </g>
  );
};